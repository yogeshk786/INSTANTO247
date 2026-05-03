// src/screens/AddAddressScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ChevronLeft, MapPin, Navigation, Edit2, CheckCircle2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

export default function AddAddressScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);

  // UI State
  const [activeTab, setActiveTab] = useState('map'); // 'map' or 'manual'
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(true);

  // Address Data State
  const [location, setLocation] = useState({ latitude: 25.7711, longitude: 73.3234 }); // Defaults to Pali
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState(''); // Flat/House No
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  // 1. Ask for permission and get GPS location on load
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsLocating(false);
        setActiveTab('manual'); // Force manual if they deny GPS
        return;
      }

      try {
        let currentLoc = await Location.getCurrentPositionAsync({});
        const coords = { latitude: currentLoc.coords.latitude, longitude: currentLoc.coords.longitude };
        setLocation(coords);
        
        // Animate map to current location
        mapRef.current?.animateToRegion({
          ...coords,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });

        await reverseGeocode(coords);
      } catch (error) {
        console.error("Error getting location", error);
      } finally {
        setIsLocating(false);
      }
    })();
  }, []);

  // 2. Turn Coordinates into Text (Reverse Geocoding)
  const reverseGeocode = async (coords) => {
    try {
      const geocode = await Location.reverseGeocodeAsync(coords);
      if (geocode.length > 0) {
        const place = geocode[0];
        setAddressLine1(`${place.name ? place.name + ', ' : ''}${place.street || place.district || ''}`);
        setCity(place.city || place.subregion || '');
        setPincode(place.postalCode || '');
      }
    } catch (error) {
      console.error("Geocoding failed", error);
    }
  };

  // 3. Triggered when user drags the map
  const onRegionChangeComplete = async (newRegion) => {
    setLocation({ latitude: newRegion.latitude, longitude: newRegion.longitude });
    await reverseGeocode({ latitude: newRegion.latitude, longitude: newRegion.longitude });
  };

  const handleSaveAddress = () => {
    setIsLoading(true);
    // Here you would push to Firebase: db -> users -> addresses
    setTimeout(() => {
      setIsLoading(false);
      alert('Address Saved Successfully!');
      navigation.goBack();
    }, 1000);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center border-b border-slate-100 z-10 bg-white">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center border border-slate-200 mr-4">
            <ChevronLeft size={24} color="#64748b" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-slate-950 tracking-tighter">Add Address</Text>
        </View>

        {/* Tab Switcher */}
        <View className="px-6 py-4 bg-white z-10">
          <View className="bg-slate-100 p-1.5 rounded-2xl flex-row">
            <TouchableOpacity 
              onPress={() => setActiveTab('map')} 
              className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${activeTab === 'map' ? 'bg-white shadow-sm' : ''}`}
            >
              <Navigation size={16} color={activeTab === 'map' ? "#f97316" : "#94a3b8"} className="mr-2" />
              <Text className={`font-black ${activeTab === 'map' ? 'text-slate-900' : 'text-slate-400'}`}>Locate on Map</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setActiveTab('manual')} 
              className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${activeTab === 'manual' ? 'bg-white shadow-sm' : ''}`}
            >
              <Edit2 size={16} color={activeTab === 'manual' ? "#f97316" : "#94a3b8"} className="mr-2" />
              <Text className={`font-black ${activeTab === 'manual' ? 'text-slate-900' : 'text-slate-400'}`}>Enter Manually</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- MAP VIEW --- */}
        {activeTab === 'map' && (
          <View className="flex-1 relative">
            {isLocating ? (
              <View className="flex-1 items-center justify-center bg-slate-50">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="mt-4 text-slate-500 font-bold">Finding your location...</Text>
              </View>
            ) : (
              <>
                <MapView
                  ref={mapRef}
                  style={{ flex: 1 }}
                  initialRegion={{ ...location, latitudeDelta: 0.005, longitudeDelta: 0.005 }}
                  onRegionChangeComplete={onRegionChangeComplete}
                  showsUserLocation={true}
                />
                
                {/* Fixed Center Pin for dragging */}
                <View className="absolute top-1/2 left-1/2 -ml-5 -mt-10 items-center justify-center pointer-events-none">
                  <MapPin size={40} color="#0f172a" fill="#0f172a" />
                  <View className="w-2 h-2 bg-black rounded-full mt-1 opacity-20 shadow-lg" />
                </View>
              </>
            )}
          </View>
        )}

        {/* --- MANUAL FORM VIEW --- */}
        {activeTab === 'manual' && (
          <ScrollView className="flex-1 px-6 pt-4 bg-slate-50">
            <Text className="text-slate-900 font-black text-xl mb-6">Address Details</Text>
            
            <View className="mb-4">
              <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Flat / House No / Building</Text>
              <TextInput 
                value={addressLine2} onChangeText={setAddressLine2}
                placeholder="e.g. Flat 4B, Golden Tower"
                className="bg-white border border-slate-200 rounded-2xl h-14 px-4 text-base font-bold text-slate-900 shadow-sm"
              />
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Street / Area</Text>
              <TextInput 
                value={addressLine1} onChangeText={setAddressLine1}
                placeholder="e.g. Sector 4, Shyam Nagar"
                className="bg-white border border-slate-200 rounded-2xl h-14 px-4 text-base font-bold text-slate-900 shadow-sm"
              />
            </View>

            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">City</Text>
                <TextInput 
                  value={city} onChangeText={setCity}
                  placeholder="e.g. Pali"
                  className="bg-white border border-slate-200 rounded-2xl h-14 px-4 text-base font-bold text-slate-900 shadow-sm"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Pincode</Text>
                <TextInput 
                  value={pincode} onChangeText={setPincode} keyboardType="number-pad"
                  placeholder="e.g. 306401"
                  className="bg-white border border-slate-200 rounded-2xl h-14 px-4 text-base font-bold text-slate-900 shadow-sm"
                />
              </View>
            </View>
          </ScrollView>
        )}

        {/* --- BOTTOM SHEET / FOOTER --- */}
        <View className="bg-white border-t border-slate-100 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
          {activeTab === 'map' && (
            <View className="mb-4 flex-row items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <MapPin size={24} color="#f97316" className="mr-3" />
              <View className="flex-1">
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">Detected Location</Text>
                <Text className="text-slate-900 font-black text-sm" numberOfLines={2}>
                  {addressLine1 || 'Move pin to detect address'}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity 
            activeOpacity={0.8} onPress={handleSaveAddress} disabled={isLoading}
            className={`h-14 rounded-2xl flex-row items-center justify-center shadow-md ${isLoading ? 'bg-slate-400' : 'bg-slate-950'}`}
          >
            {isLoading ? <ActivityIndicator color="white" /> : (
              <>
                <CheckCircle2 size={20} color="white" className="mr-2" />
                <Text className="text-white font-black text-lg">Save & Continue</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}