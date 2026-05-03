import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pencil, Home, Zap, Globe, ChevronRight, LogOut } from 'lucide-react-native';

// --- FIREBASE INTEGRATION ---
import { doc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../config/firebase'; // 🚨 Make sure auth is imported!

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userRef = doc(db, 'users', 'admin_jitendra');
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🚨 NEW: SAFE LOGOUT FUNCTION
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of Instanto?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              // Your AppNavigator will automatically detect this and show the Auth screen!
            } catch (error) {
              console.error("Error logging out: ", error);
              Alert.alert("Error", "Failed to log out. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      
      {/* --- HEADER --- */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <View>
          <Text className="text-4xl font-black text-slate-950 tracking-tighter mb-0.5">Profile</Text>
          <Text className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Manage Account</Text>
        </View>
        
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => navigation.navigate('EditProfile')}
          className="w-12 h-12 bg-white rounded-2xl items-center justify-center border border-slate-200 shadow-sm"
        >
          <Pencil size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* --- USER INFO CARD --- */}
        <View className="bg-white rounded-[2rem] p-5 flex-row items-center border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-8">
          <View className="w-20 h-20 bg-orange-50 rounded-2xl mr-5 items-center justify-center overflow-hidden border border-orange-100">
            <Image 
              source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Jitendra&backgroundColor=ffedd5' }} 
              className="w-full h-full"
            />
          </View>
          
          <View className="flex-1">
            {isLoading ? (
              <ActivityIndicator size="small" color="#f97316" style={{ alignSelf: 'flex-start' }} />
            ) : (
              <>
                <Text className="text-xl font-black text-slate-950 mb-1" numberOfLines={1}>
                  {userData?.name || 'New User'}
                </Text>
                <Text className="text-sm font-bold text-slate-500 mb-0.5">
                  {userData?.phone || 'Add Phone Number'}
                </Text>
                <Text className="text-sm font-medium text-slate-400" numberOfLines={1}>
                  {userData?.email || 'Add Email Address'}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* --- SAVED ADDRESSES SECTION --- */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-black text-slate-950">Saved Addresses</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddAddress')}>
            <Text className="text-orange-500 font-bold text-sm">+ Add New</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={() => navigation.navigate('AddAddress')}
          className="bg-white rounded-[2rem] p-5 flex-row items-center border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-8"
        >
          <View className="w-14 h-14 bg-slate-50 rounded-2xl items-center justify-center mr-4 border border-slate-100">
            <Home size={24} color="#0f172a" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center mb-1 gap-2">
              <Text className="text-lg font-black text-slate-950">Home</Text>
              <View className="bg-slate-100 px-2 py-0.5 rounded-md">
                <Text className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Default</Text>
              </View>
            </View>
            <Text className="text-sm font-medium text-slate-500 leading-snug pr-4">
              {userData?.address || '30, Swami Vivekanand Marg, Pali, Rajasthan'}
            </Text>
          </View>
          <ChevronRight size={20} color="#cbd5e1" />
        </TouchableOpacity>

        {/* --- ACTION BUTTONS --- */}
        <TouchableOpacity activeOpacity={0.8} className="bg-slate-950 rounded-3xl p-5 flex-row items-center justify-between mb-4 shadow-md">
          <View className="flex-row items-center gap-4">
            <Zap size={22} color="#f97316" fill="#f97316" />
            <Text className="text-white font-black text-base">What is Instanto?</Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} className="bg-white rounded-3xl p-5 flex-row items-center justify-between border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-4">
          <View className="flex-row items-center gap-4">
            <Globe size={22} color="#94a3b8" />
            <Text className="text-slate-950 font-black text-base">App Language</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-orange-500 font-black text-xs uppercase tracking-widest">English</Text>
            <ChevronRight size={20} color="#cbd5e1" />
          </View>
        </TouchableOpacity>

        {/* 🚨 NEW: LOGOUT BUTTON 🚨 */}
        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={handleLogout}
          className="bg-red-50 rounded-3xl p-5 flex-row items-center justify-between border border-red-100 shadow-sm mt-4"
        >
          <View className="flex-row items-center gap-4">
            <LogOut size={22} color="#ef4444" />
            <Text className="text-red-500 font-black text-base">Log Out</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}