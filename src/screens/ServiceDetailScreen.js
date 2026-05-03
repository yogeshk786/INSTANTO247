// src/screens/ServiceDetailScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { ArrowLeft, Clock, ShieldCheck, CheckCircle2, ShoppingBag } from 'lucide-react-native';

// Import our new global memory
import { useCartStore } from '../store/useCartStore';

export default function ServiceDetailScreen({ route, navigation }) {
  // 1. Catch the exact service the user clicked on the Home Screen
  const { service } = route.params; 
  
  // 2. Connect to our global cart
  const { addToCart, cart } = useCartStore();
  
  // Check if this specific service is already in the cart
  const isInCart = cart.some(item => item.id === service.id);

  // Safely handle the dynamic icon
  const Icon = service.icon;

  const handleAddCart = () => {
    addToCart(service);
    // Automatically take them back to Home so they can see the bottom Cart Bar appear
    
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center"
        >
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-base font-black text-slate-900 tracking-tight">Service Details</Text>
        <View className="w-10" /> {/* Spacer for centering */}
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* HERO ICON */}
        <View className="w-24 h-24 rounded-3xl items-center justify-center mb-6 self-center" style={{ backgroundColor: `${service.color || '#f97316'}15` }}>
          {Icon ? <Icon size={48} color={service.color || '#f97316'} strokeWidth={2} /> : <ShoppingBag size={48} color="#f97316" />}
        </View>

        {/* TITLE & PRICE */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-black text-slate-900 mb-2">{service.name || service.title}</Text>
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-2xl font-black text-orange-500">₹{service.price}</Text>
            <Text className="text-sm font-bold text-slate-400 line-through">₹{Math.floor(service.price * 1.4)}</Text>
          </View>
        </View>

        {/* INFO BADGES */}
        <View className="flex-row justify-between mb-8">
          <View className="flex-1 bg-slate-50 p-4 rounded-2xl mr-2 items-center">
            <Clock size={24} color="#64748b" className="mb-2" />
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest">Duration</Text>
            <Text className="text-sm font-black text-slate-900 mt-1">{service.time || '45 mins'}</Text>
          </View>
          <View className="flex-1 bg-slate-50 p-4 rounded-2xl ml-2 items-center">
            <ShieldCheck size={24} color="#64748b" className="mb-2" />
            <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest">Warranty</Text>
            <Text className="text-sm font-black text-slate-900 mt-1">30 Days</Text>
          </View>
        </View>

        {/* DESCRIPTION */}
        <Text className="text-lg font-black text-slate-900 mb-4">What's included?</Text>
        <Text className="text-base text-slate-600 leading-relaxed font-medium mb-6">
          {service.description}
        </Text>

        <View className="bg-green-50 p-4 rounded-2xl flex-row items-center mb-10 border border-green-100">
          <CheckCircle2 size={20} color="#16a34a" className="mr-3" />
          <Text className="flex-1 text-sm font-bold text-green-800 leading-tight">
            Instanto Guarantee: Expert technician assigned within 10 minutes.
          </Text>
        </View>
        
        <View className="h-20" />
      </ScrollView>

      {/* FIXED BOTTOM ACTION BAR */}
      <View 
        className="absolute bottom-0 left-0 right-0 bg-white px-6 pt-4 pb-8 border-t border-slate-100"
        style={Platform.select({
          web: { boxShadow: '0px -10px 30px rgba(0,0,0,0.05)' },
          default: { shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 10 }
        })}
      >
        <TouchableOpacity 
          disabled={isInCart}
          onPress={handleAddCart}
          className={`h-16 rounded-2xl flex-row items-center justify-center ${isInCart ? 'bg-slate-200' : 'bg-slate-900'}`}
        >
          {isInCart ? (
            <Text className="text-slate-500 font-black text-lg">Already in Cart</Text>
          ) : (
            <>
              <ShoppingBag size={20} color="white" className="mr-3" />
              <Text className="text-white font-black text-lg">Add to Cart • ₹{service.price}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}