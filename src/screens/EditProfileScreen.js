// src/screens/EditProfileScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ChevronLeft, User, Phone, Mail, Save } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 🚨 FIREBASE IMPORTS
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function EditProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  
  // Local state for the form. 
  // In a full app, you would initialize these with the user's current data from Zustand or Firebase!
  const [name, setName] = useState('Jitendra Kumar Kawar');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('jitendra@nakodainteriors.com');
  const [isLoading, setIsLoading] = useState(false);

  // --- FIREBASE SAVE FUNCTION ---
  const handleSaveProfile = async () => {
    if (!name || !phone || !email) {
      Alert.alert("Missing Info", "Please fill out all fields.");
      return;
    }

    setIsLoading(true);

    try {
      // 🚨 Replace 'admin_jitendra' with actual user ID from your Auth system later!
      const userRef = doc(db, 'users', 'admin_jitendra'); 
      
      // We use setDoc with merge: true so it creates the doc if it doesn't exist, 
      // or just updates these specific fields if it does.
      await setDoc(userRef, {
        name: name,
        phone: phone,
        email: email,
        lastUpdated: new Date()
      }, { merge: true });

      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack(); // Send them back to the profile screen
      
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Could not connect to database. Check terminal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
    >
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center border-b border-slate-200 bg-slate-50 z-10">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-slate-200 mr-4 shadow-sm"
          >
            <ChevronLeft size={24} color="#64748b" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-slate-950 tracking-tighter">Edit Profile</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6 pt-6">
          
          {/* Input Group: Name */}
          <View className="mb-5">
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Name</Text>
            <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl h-14 px-4 shadow-sm">
              <User size={20} color="#94a3b8" />
              <TextInput 
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                className="flex-1 ml-3 text-base font-bold text-slate-900"
              />
            </View>
          </View>

          {/* Input Group: Phone */}
          <View className="mb-5">
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Phone Number</Text>
            <View className="flex-row items-center bg-slate-100 border border-slate-200 rounded-2xl h-14 px-4">
              <Phone size={20} color="#94a3b8" />
              <TextInput 
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="Enter phone number"
                // Adding text-slate-400 to indicate it might not be editable later if tied to OTP
                className="flex-1 ml-3 text-base font-bold text-slate-500" 
              />
            </View>
          </View>

          {/* Input Group: Email */}
          <View className="mb-8">
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</Text>
            <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl h-14 px-4 shadow-sm">
              <Mail size={20} color="#94a3b8" />
              <TextInput 
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter email address"
                className="flex-1 ml-3 text-base font-bold text-slate-900"
              />
            </View>
          </View>

        </ScrollView>

        {/* Save Button (Sticks to bottom) */}
        <View className="px-6 pb-6 bg-slate-50" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handleSaveProfile}
            disabled={isLoading}
            className={`flex-row items-center justify-center h-16 rounded-2xl shadow-md ${isLoading ? 'bg-slate-400' : 'bg-orange-500'}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Save size={20} color="white" className="mr-2" />
                <Text className="text-white font-black text-lg">Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}