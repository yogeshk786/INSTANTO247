// src/screens/HomeScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Zap, CloudSun, Search, Mic, ChevronRight, Trophy, Timer } from 'lucide-react-native';
import { useStore } from '../store/useStore';

// IMPORT DATA AND COMPONENTS
import { SERVICES, TROJAN_SERVICES } from '../constants/data';
import ServiceCard from '../components/ServiceCard';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useStore(); 
  const t = (en, hi) => language === 'English' ? en : hi;
  
  const isHighTraffic = true; 

  return (
    <ScrollView className="flex-1 bg-slate-50 pt-16" showsVerticalScrollIndicator={false}>
      
      {/* Top Padding Wrapper */}
      <View className="px-6">
        
        {/* --- Header Section --- */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-8">
            <View className={`flex-row items-center gap-2 px-3 py-1.5 rounded-full border ${isHighTraffic ? 'bg-orange-500 border-orange-400' : 'bg-white border-slate-200'}`}>
              <Zap size={12} color={isHighTraffic ? "white" : "#ea580c"} />
              <Text className={`text-[10px] font-black uppercase tracking-widest ${isHighTraffic ? 'text-white' : 'text-orange-600'}`}>
                {isHighTraffic ? t('High Demand Area', 'Kafi Demand Hai') : t('Live Dispatch', 'Turant Dispatch')}
              </Text>
            </View>
            
            <View className="flex-row items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200">
              <CloudSun size={14} color="#f59e0b" />
              <Text className="text-[10px] font-black text-slate-600 uppercase">32°C • Humid</Text>
            </View>
          </View>

          <Text className="text-4xl font-black text-slate-950 tracking-tighter mb-1">
            {t('Instant repairs,', 'Turant repair,')}
          </Text>
          <Text className="text-4xl font-black text-orange-500 tracking-tighter mb-6">
            {t('zero delays.', 'bina intezaar.')}
          </Text>

          {/* Search Bar */}
          <View className="relative w-full flex-row items-center bg-white border border-slate-200 rounded-full h-14 px-4 shadow-sm mb-8">
            <Search color="#94a3b8" size={20} />
            <TextInput 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t("Search for AC repair, plumbing...", "Kya theek karna hai?")}
              placeholderTextColor="#94a3b8"
              className="flex-1 h-full ml-3 text-base font-bold text-slate-900"
            />
            <TouchableOpacity className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center">
              <Mic size={20} color="#f97316" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Hero Image Poster --- */}
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

        {/* --- NEW: Trojan Horse / Expert Diagnostics Section --- */}
        <View className="bg-white rounded-[2rem] p-1.5 shadow-[0_8px_30px_rgba(249,115,22,0.12)] border border-orange-100 mb-10">
          <View className="bg-orange-50 rounded-[1.75rem] p-6 relative overflow-hidden">
            
            {/* Header for Diagnostics */}
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

            {/* List of Micro-Services */}
            <View className="flex-col gap-3">
              {TROJAN_SERVICES.map(ts => {
                const Icon = ts.icon;
                return (
                  <TouchableOpacity
                    key={ts.id}
                    activeOpacity={0.8}
                    className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex-row items-center gap-4"
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

        {/* --- DYNAMIC SERVICE GRID --- */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-black tracking-tight text-slate-950">
              {t('Highly Recommended', 'Khas Aapke Liye')}
            </Text>
            <TouchableOpacity className="flex-row items-center gap-1">
              <Text className="text-xs font-bold text-orange-600">See All</Text>
              <ChevronRight size={14} color="#ea580c" />
            </TouchableOpacity>
          </View>
          
          {SERVICES.slice(0, 4).map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              isHighTraffic={isHighTraffic}
              onPress={() => console.log("Pressed:", service.name)} 
            />
          ))}
        </View>
        
        {/* Extra padding at the bottom so the last card isn't hidden behind our floating Tab Bar! */}
        <View className="h-32" />
      </View>
    </ScrollView>
  );
}