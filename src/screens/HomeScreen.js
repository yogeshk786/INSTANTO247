// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { Zap, CloudSun, Search, Mic, ChevronRight, Trophy, Timer, Bell, MapPin, X } from 'lucide-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

// STATE & DATABASE IMPORTS
import { useStore } from '../store/useStore';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// DATA & COMPONENTS
import { SERVICES, TROJAN_SERVICES } from '../constants/data';
import ServiceCard from '../components/ServiceCard';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNotifications, setHasNotifications] = useState(true); 
  
  // LIVE DATA STATES
  const [locationName, setLocationName] = useState('Locating...');
  const [temperature, setTemperature] = useState('--');
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  const { language } = useStore(); 
  const t = (en, hi) => language === 'English' ? en : hi;
  const insets = useSafeAreaInsets();
  const isHighTraffic = true; 

  // 1. SEARCH LOGIC
  const filteredServices = SERVICES.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 2. FETCH LIVE LOCATION & WEATHER
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationName('Pali, Rajasthan');
          setIsWeatherLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const { latitude, longitude } = location.coords;

        let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode.length > 0) {
          const localName = geocode[0].district || geocode[0].subregion || geocode[0].city || 'Pali';
          setLocationName(localName);
        }

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        
        if (weatherData.current_weather) {
          setTemperature(`${Math.round(weatherData.current_weather.temperature)}°C`);
        }
      } catch (error) {
        console.error("Location/Weather Error:", error);
        setLocationName('Pali');
      } finally {
        setIsWeatherLoading(false);
      }
    })();
  }, []);

  const handleNotificationClick = async () => {
    try {
      await addDoc(collection(db, "user_activity"), {
        event: "notification_bell_clicked",
        user: "Admin",
        timestamp: new Date()
      });
      setHasNotifications(false);
      alert("Notifications synced with Firebase!");
    } catch (e) {
      console.error("Firebase Error: ", e);
    }
  };

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      
      {/* --- BRANDING HEADER --- */}
      <View className="px-6 py-2 flex-row items-center justify-between bg-slate-50 z-10">
        <Text className="text-[32px] font-black text-slate-950 tracking-tighter" style={{ letterSpacing: -1.5 }}>
          Instanto
        </Text>
        
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handleNotificationClick}
          className="w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-200 shadow-sm relative"
        >
          {hasNotifications && (
            <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white z-10" />
          )}
          <Bell size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 pt-2" showsVerticalScrollIndicator={false}>
        <View className="px-6">

          {/* --- LIVE STATUS ROW --- */}
          <View className="mb-8 mt-2">
            <View className="flex-row items-center justify-between mb-8">
              
              {/* Live Location Badge */}
              <View className="flex-row items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full shadow-md max-w-[55%]">
                <MapPin size={12} color="#f97316" />
                <Text className="text-[10px] font-black text-white uppercase tracking-widest" numberOfLines={1}>
                  {locationName}
                </Text>
              </View>
              
              {/* Live Weather Badge */}
              <View className="flex-row items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <CloudSun size={14} color="#f59e0b" />
                {isWeatherLoading ? (
                   <ActivityIndicator size="small" color="#f59e0b" style={{ width: 30, height: 14 }} />
                ) : (
                   <Text className="text-[10px] font-black text-slate-600 uppercase">
                     {temperature} • {t('Live', 'Live')}
                   </Text>
                )}
              </View>
            </View>

            <Text className="text-4xl font-black text-slate-950 tracking-tighter mb-1">
              {t('Instant repairs,', 'Turant repair,')}
            </Text>
            <Text className="text-4xl font-black text-orange-500 tracking-tighter mb-6">
              {t('zero delays.', 'bina intezaar.')}
            </Text>

            {/* --- FUNCTIONAL SEARCH BAR --- */}
            <View className="relative w-full flex-row items-center bg-white border border-slate-200 rounded-full h-14 px-4 shadow-sm mb-8">
              <Search color="#94a3b8" size={20} />
              <TextInput 
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t("Search for AC, Plumber, Electrician...", "Kya theek karna hai?")}
                placeholderTextColor="#94a3b8"
                className="flex-1 h-full ml-3 text-base font-bold text-slate-900"
              />
              {searchQuery.length > 0 ? (
                <TouchableOpacity onPress={() => setSearchQuery('')} className="p-2">
                  <X size={18} color="#94a3b8" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center">
                  <Mic size={20} color="#f97316" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Hide sections if searching to focus results */}
          {searchQuery.length === 0 && (
            <>
              {/* Hero Image Poster */}
              <View className="w-full h-48 bg-slate-900 rounded-[2rem] overflow-hidden relative mb-10">
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800' }}
                  className="w-full h-full opacity-60 absolute inset-0"
                />
                <View className="absolute bottom-5 left-5 right-5">
                  <View className="bg-orange-500 px-3 py-1 rounded-full mb-2 self-start">
                    <Text className="text-white text-[10px] font-black uppercase">Genie at work 🪄</Text>
                  </View>
                  <Text className="text-white font-black text-lg shadow-sm">Skip the wait. Get it fixed instantly!</Text>
                </View>
              </View>

              {/* --- RESTORED TROJAN HORSE / EXPERT DIAGNOSTICS SECTION --- */}
              <View className="bg-white rounded-[2rem] p-1.5 shadow-[0_8px_30px_rgba(249,115,22,0.12)] border border-orange-100 mb-10">
                <View className="bg-orange-50 rounded-[1.75rem] p-6 relative overflow-hidden">
                  
                  {/* Badges Row */}
                  <View className="flex-row justify-between items-center mb-5">
                    <View className="flex-row items-center gap-1.5 bg-orange-500 px-3 py-1 rounded-full shadow-sm">
                      <Trophy size={12} color="white" />
                      <Text className="text-[10px] font-black text-white uppercase tracking-widest">Cheapest in City</Text>
                    </View>
                    <View className="flex-row items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-md">
                      <Timer size={12} color="#64748b" />
                      <Text className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">10 Min Visit</Text>
                    </View>
                  </View>

                  <Text className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-2">Expert Diagnostics</Text>
                  <Text className="text-xs text-slate-600 font-medium mb-6 leading-relaxed">
                    Not sure what's wrong? Call an expert for a quick inspection. <Text className="font-black text-green-700">100% Adjusted</Text> against your final bill.
                  </Text>

                  <View className="flex-col gap-3">
                    {TROJAN_SERVICES.map(ts => {
                      const Icon = ts.icon;
                      return (
                        <TouchableOpacity
                          key={ts.id}
                          activeOpacity={0.8}
                          className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex-row items-center gap-4"
                          onPress={() => navigation.navigate('BookingOptions', { serviceId: ts.id })} 
                        >
                          <View className="w-14 h-14 bg-slate-50 rounded-xl items-center justify-center border border-slate-100">
                            {Icon && <Icon size={24} color="#64748b" />}
                          </View>
                          
                          <View className="flex-1">
                            <View className="flex-row justify-between items-start mb-1">
                              <Text className="font-bold text-slate-900 text-sm flex-1 pr-2">{ts.name}</Text>
                              <Text className="text-lg font-black text-slate-900">₹{ts.price}</Text>
                            </View>
                            <View className="flex-row items-center justify-between">
                              <Text className="text-[10px] text-slate-500 font-medium flex-1 pr-2" numberOfLines={1}>
                                {ts.description.split('.')[0]}
                              </Text>
                              <View className="w-6 h-6 rounded-full bg-slate-50 items-center justify-center">
                                <ChevronRight size={14} color="#94a3b8" />
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            </>
          )}

          {/* --- FILTERED SERVICE GRID --- */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-black tracking-tight text-slate-950">
                {searchQuery.length > 0 ? t('Search Results', 'Result Mile') : t('Highly Recommended', 'Khas Aapke Liye')}
              </Text>
              {searchQuery.length === 0 && (
                <TouchableOpacity className="flex-row items-center gap-1">
                  <Text className="text-xs font-bold text-orange-600">See All</Text>
                  <ChevronRight size={14} color="#ea580c" />
                </TouchableOpacity>
              )}
            </View>
            
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  isHighTraffic={isHighTraffic}
                  onPress={() => navigation.navigate('BookingOptions', { serviceId: service.id })} 
                />
              ))
            ) : (
              <View className="py-20 items-center">
                <Text className="text-slate-400 font-bold text-lg">No services found for "{searchQuery}"</Text>
              </View>
            )}
          </View>
          
          <View className="h-32" />
        </View>
      </ScrollView>
    </View>
  );
}