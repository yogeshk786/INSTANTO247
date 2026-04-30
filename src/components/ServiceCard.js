// src/components/ServiceCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Clock, ShieldCheck, Star, Plus } from 'lucide-react-native';

export default function ServiceCard({ service, onPress, isHighTraffic }) {
  const Icon = service.icon;
  const finalPrice = Math.round(service.price * (isHighTraffic ? 1.5 : 1));
  const strikePrice = finalPrice * 2;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      // Note: Removed shadow classes here for web stability
      className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden mb-4"
    >
      <View className="relative w-full h-32 bg-slate-100">
        <Image
          source={{ uri: service.image }}
          className="w-full h-full absolute inset-0 opacity-90"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-slate-900/30" />

        <View className="absolute bottom-3 left-3 right-3 flex-row items-end justify-between">
          <View className="flex-row items-center gap-2 flex-1 pr-2">
            <View className="bg-white/20 p-1.5 rounded-xl border border-white/30">
              {Icon && <Icon size={16} color="white" />}
            </View>
            <Text className="text-white font-black text-sm flex-1" numberOfLines={1}>
              {service.name}
            </Text>
          </View>
          <View className="flex-row items-center gap-1 bg-amber-500 px-1.5 py-0.5 rounded border border-amber-400">
            <Star size={10} color="white" fill="white" />
            <Text className="text-white text-[9px] font-black">{service.rating}</Text>
          </View>
        </View>
      </View>

      <View className="p-4">
        <View className="mb-3">
          <View className="flex-row items-center gap-1 mb-1.5">
            <Clock size={12} color="#94a3b8" />
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {service.duration}
            </Text>
          </View>
          <Text className="text-xs font-medium text-slate-500 leading-relaxed" numberOfLines={2}>
            {service.description}
          </Text>
        </View>

        <View className="pt-3 border-t border-slate-100 flex-row items-end justify-between">
          <View>
            <View className="flex-row items-center gap-1.5 mb-1">
              {service.hasWarranty && (
                <View className="bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded flex-row items-center gap-1">
                  <ShieldCheck size={8} color="#2563eb" />
                  <Text className="text-[9px] font-black text-blue-600 uppercase">Warranty</Text>
                </View>
              )}
              <Text className="text-[10px] text-slate-400 font-bold" style={{ textDecorationLine: 'line-through' }}>
                ₹{strikePrice}
              </Text>
              <View className="bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">
                <Text className="text-[9px] font-black text-green-600">50% OFF</Text>
              </View>
            </View>
            
            <View className="flex-row items-end">
              <Text className="font-black text-slate-900 text-xl leading-none">
                ₹{finalPrice}
              </Text>
              {service.pricingType === 'hourly' && (
                <Text className="text-[10px] text-slate-500 font-bold ml-0.5 mb-0.5">/hr</Text>
              )}
            </View>
          </View>

          <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center border border-slate-200">
            <Plus size={16} color="#94a3b8" strokeWidth={3} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}