import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { CalendarClock, MapPin, X, ChevronRight } from 'lucide-react-native';
import { useCartStore } from '../store/useCartStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 🚨 1. IMPORT FIREBASE
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ActivityScreen({ navigation }) {
  const { cart, removeFromCart } = useCartStore();
  const insets = useSafeAreaInsets();
  
  // 🚨 2. STATE FOR REAL-TIME ADDRESS
  const [userData, setUserData] = useState(null);

  // 🚨 3. LIVE DATABASE LISTENER (This connects it to your Profile!)
  useEffect(() => {
    // We listen to the EXACT SAME document as your Profile screen
    const userRef = doc(db, 'users', 'admin_jitendra');
    
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    });
    
    return () => unsubscribe();
  }, []);

  const totalCost = cart?.reduce((sum, item) => sum + item.price, 0) || 0;

  // --- EMPTY STATE ---
  if (!cart || cart.length === 0) {
    return (
      <View 
        className="flex-1 bg-slate-50 justify-center items-center px-6"
        style={{ paddingTop: insets.top }}
      >
        <View className="w-24 h-24 bg-slate-200 rounded-full items-center justify-center mb-6">
          <CalendarClock size={48} color="#94a3b8" />
        </View>
        <Text className="text-2xl font-black text-slate-900 mb-2 text-center">No Active Bookings</Text>
        <Text className="text-slate-500 text-center mb-8 font-medium">Your upcoming services and repairs will appear here.</Text>
        <TouchableOpacity 
          className="bg-orange-500 px-10 py-4 rounded-2xl shadow-sm"
          onPress={() => navigation.navigate('Home')}
        >
          <Text className="text-white font-black tracking-wide">Browse Services</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- POPULATED STATE ---
  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 pb-6 pt-4 border-b border-slate-100 bg-white">
        <Text className="text-3xl font-black text-slate-900 tracking-tight">My Bookings</Text>
        <Text className="text-sm font-bold text-slate-500 mt-1">
          {cart.length} Service{cart.length > 1 ? 's' : ''} Pending
        </Text>
      </View>

      <ScrollView 
        className="flex-1 px-6 pt-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        {cart.map((item, index) => (
          <View key={`${item.id}-${index}`} className="bg-white rounded-3xl p-4 mb-4 border border-slate-100 shadow-sm flex-row items-center">
            <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=200' }} className="w-20 h-20 rounded-2xl bg-slate-200 mr-4" />
            <View className="flex-1">
              <Text className="text-base font-bold text-slate-900 mb-0.5" numberOfLines={1}>{item.name}</Text>
              <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{item.duration || '30-60 Min'}</Text>
              <Text className="text-orange-500 font-black text-xl">₹{item.price}</Text>
            </View>
            <TouchableOpacity 
              activeOpacity={0.7}
              className="w-10 h-10 bg-red-50 rounded-full items-center justify-center"
              onPress={() => removeFromCart(item.id)}
            >
              <X size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}

        {/* 🚨 THE SYNCED LOCATION CARD 🚨 */}
        <View className="bg-slate-900 rounded-[2rem] p-6 mt-2">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-orange-500/20 rounded-full items-center justify-center">
                <MapPin size={20} color="#f97316" />
              </View>
              <Text className="text-white font-black text-sm uppercase tracking-widest">Service Location</Text>
            </View>
            
            {/* The Change button now opens your Map! */}
            <TouchableOpacity onPress={() => navigation.navigate('AddAddress')}>
               <Text className="text-orange-500 font-bold text-xs">Change</Text>
            </TouchableOpacity>
          </View>
          
          {/* This text now pulls directly from Firebase! */}
          <Text className="text-slate-300 font-medium text-base" numberOfLines={2}>
            {userData?.address || 'Tap Change to set your service address'}
          </Text> 
        </View>
      </ScrollView>

      {/* Floating Checkout Bar */}
      <View 
        className="absolute left-5 right-5 bg-white p-5 rounded-[2.5rem] border border-slate-100 flex-row items-center justify-between shadow-2xl"
        style={{ bottom: insets.bottom + 85 }} 
      >
        <View>
          <Text className="text-slate-400 font-black text-[10px] mb-0.5 uppercase tracking-widest">Grand Total</Text>
          <View className="flex-row items-end">
            <Text className="text-2xl font-black text-slate-900">₹{totalCost}</Text>
            <Text className="text-slate-400 text-[10px] font-bold mb-1 ml-1">incl. tax</Text>
          </View>
        </View>
        <TouchableOpacity 
          activeOpacity={0.8}
          className="bg-orange-500 px-10 py-4 rounded-2xl shadow-lg flex-row items-center"
          onPress={() => alert('Opening Payment Gateway...')}
        >
          <Text className="text-white font-black text-base tracking-wide mr-2">Checkout</Text>
          <ChevronRight size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}