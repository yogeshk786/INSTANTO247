import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, PanResponder, Dimensions } from 'react-native';
import { X, TrendingUp, Zap, Calendar, Timer, ArrowRight, ChevronLeft, ShieldCheck, Ticket, AlertCircle, Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../store/useCartStore';
import { TROJAN_SERVICES, SERVICES } from '../constants/data';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width - 48;
const BUTTON_WIDTH = 64;

// --- 1. DYNAMIC DATE GENERATOR ---
const getNext7Days = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push({
      id: i.toString(),
      date: nextDate.getDate(),
      // Smart labels for Today and Tomorrow
      day: i === 0 ? 'Today' : i === 1 ? 'Tmrw' : nextDate.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: nextDate.toDateString()
    });
  }
  return dates;
};

// --- 2. DYNAMIC TIME GENERATOR (10 AM to 10 PM) ---
const generateTimeSlots = () => {
  const slots = [];
  let startTime = 10 * 60; // 10:00 AM in minutes
  const endTime = 22 * 60; // 10:00 PM in minutes
  
  while (startTime <= endTime) {
    const hours = Math.floor(startTime / 60);
    const mins = startTime % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMins = mins < 10 ? '0' + mins : mins;
    slots.push(`${formattedHours}:${formattedMins} ${ampm}`);
    
    // Change this to 60 if you want 1-hour gaps instead of 30-minute gaps
    startTime += 30; 
  }
  return slots;
};

export default function BookingOptionsScreen({ route, navigation }) {
  const { serviceId } = route.params;
  const insets = useSafeAreaInsets();
  const { addToCart } = useCartStore();
  
  const service = [...SERVICES, ...TROJAN_SERVICES].find(s => s.id === serviceId);

  const [step, setStep] = useState(1);
  const [bookingType, setBookingType] = useState('instant');
  
  // Memoize so they don't recalculate on every render
  const scheduleDates = useMemo(() => getNext7Days(), []);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Set default selections to the first available option
  const [selectedDate, setSelectedDate] = useState(scheduleDates[0].id);
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);

  const pan = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx >= 0 && gestureState.dx <= SLIDE_WIDTH - BUTTON_WIDTH) {
          pan.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SLIDE_WIDTH * 0.7) {
          Animated.spring(pan, { toValue: SLIDE_WIDTH - BUTTON_WIDTH, useNativeDriver: false }).start();
          setTimeout(() => {
            // 🚨 Attach the chosen schedule details to the cart item!
            const finalService = bookingType === 'schedule' 
              ? { ...service, scheduledDate: scheduleDates.find(d => d.id === selectedDate).fullDate, scheduledTime: selectedTime } 
              : service;
            
            addToCart(finalService);
            navigation.navigate('MainTabs', { screen: 'Activity' });
          }, 300);
        } else {
          Animated.spring(pan, { toValue: 0, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  if (!service) return null;

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 flex-row items-center justify-between py-4">
        <TouchableOpacity 
          onPress={() => step === 1 ? navigation.goBack() : setStep(1)}
          className="w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center"
        >
          {step === 1 ? <X size={24} color="#64748b" /> : <ChevronLeft size={24} color="#64748b" />}
        </TouchableOpacity>
        
        <View className="items-center">
          <Text className="text-xl font-black text-slate-900">{service.name}</Text>
          <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {step} of 2</Text>
        </View>
        <View className="w-12" />
      </View>

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {step === 1 ? (
          <View>
            {/* Warning Banner */}
            <View className="bg-orange-50 border border-orange-100 rounded-3xl p-5 flex-row items-start gap-4 mb-6">
              <TrendingUp size={20} color="#f97316" />
              <View className="flex-1">
                <Text className="text-orange-600 font-black text-xs uppercase mb-1">High Demand Active</Text>
                <Text className="text-orange-900/60 text-xs font-bold">Prices adjusted to guarantee rapid dispatch.</Text>
              </View>
            </View>

            {/* Toggle Buttons */}
            <View className="bg-slate-100 p-1.5 rounded-3xl flex-row mb-8">
              <TouchableOpacity onPress={() => setBookingType('instant')} className={`flex-1 flex-row items-center justify-center py-4 rounded-2xl ${bookingType === 'instant' ? 'bg-white shadow-sm' : ''}`}>
                <Zap size={18} color={bookingType === 'instant' ? "#f97316" : "#94a3b8"} fill={bookingType === 'instant' ? "#f97316" : "none"} />
                <Text className={`ml-2 font-black ${bookingType === 'instant' ? 'text-slate-900' : 'text-slate-400'}`}>Instanto Now</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setBookingType('schedule')} className={`flex-1 flex-row items-center justify-center py-4 rounded-2xl ${bookingType === 'schedule' ? 'bg-white shadow-sm' : ''}`}>
                <Calendar size={18} color={bookingType === 'schedule' ? "#f97316" : "#94a3b8"} />
                <Text className={`ml-2 font-black ${bookingType === 'schedule' ? 'text-slate-900' : 'text-slate-400'}`}>Schedule</Text>
              </TouchableOpacity>
            </View>

            {/* --- INSTANT UI --- */}
            {bookingType === 'instant' ? (
              <View className="bg-orange-50/50 border border-orange-100 rounded-[2.5rem] p-10 items-center justify-center">
                <Timer size={40} color="#f97316" style={{ marginBottom: 16 }} />
                <Text className="text-2xl font-black text-slate-900 mb-2">Ready to dispatch!</Text>
                <Text className="text-slate-500 font-bold">Arrival in <Text className="text-orange-600">15-20 mins</Text>.</Text>
              </View>
            ) : (
              /* --- SLEEK SCHEDULE UI --- */
              <View>
                {/* Date Scroller */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-slate-900 font-black text-lg">Select Date</Text>
                  <Text className="text-slate-400 font-bold text-xs">{scheduleDates.find(d => d.id === selectedDate)?.fullDate}</Text>
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8" contentContainerStyle={{ paddingRight: 20 }}>
                  {scheduleDates.map((item) => {
                    const isSelected = selectedDate === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.7}
                        onPress={() => setSelectedDate(item.id)}
                        className={`mr-3 items-center justify-center w-[72px] h-[88px] rounded-3xl border ${isSelected ? 'bg-slate-900 border-slate-900 shadow-md' : 'bg-white border-slate-200'}`}
                      >
                        <Text className={`font-bold text-xs mb-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{item.day}</Text>
                        <Text className={`font-black text-2xl ${isSelected ? 'text-white' : 'text-slate-900'}`}>{item.date}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Time Grid */}
                <Text className="text-slate-900 font-black text-lg mb-4">Select Time</Text>
                <View className="flex-row flex-wrap justify-between gap-y-3">
                  {timeSlots.map((time, index) => {
                    const isSelected = selectedTime === time;
                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        onPress={() => setSelectedTime(time)}
                        className={`w-[48%] py-3.5 rounded-2xl flex-row items-center justify-center border ${isSelected ? 'bg-orange-50 border-orange-500' : 'bg-white border-slate-200'}`}
                      >
                        <Clock size={14} color={isSelected ? "#f97316" : "#64748b"} className="mr-2" />
                        <Text className={`font-bold text-sm ${isSelected ? 'text-orange-600' : 'text-slate-600'}`}>{time}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        ) : (
          <View>
            {/* Step 2 Summary Content (Remains identical) */}
            <View className="bg-slate-950 rounded-[2.5rem] p-8 mb-6">
              <View className="flex-row justify-between mb-4">
                <Text className="text-slate-400 font-bold">Base Service  <Text className="text-slate-600 line-through">₹598</Text></Text>
                <Text className="text-white font-bold">₹299</Text>
              </View>
              <View className="bg-green-900/30 self-start px-2 py-1 rounded-md mb-4">
                <Text className="text-green-400 text-[10px] font-black uppercase">50% OFF Applied</Text>
              </View>
              <View className="flex-row justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <Zap size={14} color="#f97316" fill="#f97316" />
                  <Text className="text-orange-500 font-black">Demand Surge</Text>
                </View>
                <Text className="text-orange-500 font-black">+₹150</Text>
              </View>
              <View className="flex-row justify-between mb-6 pb-6 border-b border-white/10">
                <Text className="text-slate-400 font-bold">1-Year Protection Fee</Text>
                <Text className="text-green-400 font-black">FREE</Text>
              </View>
              <View className="flex-row justify-between items-end">
                <View>
                  <Text className="text-slate-400 text-[10px] font-black uppercase mb-1">Total</Text>
                  <Text className="text-4xl font-black text-white tracking-tighter">₹449</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <ShieldCheck size={16} color="#4ade80" />
                  <Text className="text-green-400 font-black text-[10px] uppercase">Rework Warranty</Text>
                </View>
              </View>
            </View>
            <View className="bg-slate-50 border border-slate-100 rounded-3xl p-5">
              <View className="flex-row items-center gap-3 mb-3">
                <Ticket size={20} color="#94a3b8" />
                <Text className="text-slate-900 font-black uppercase text-xs tracking-widest">Offers & Vouchers</Text>
              </View>
              <View className="bg-red-50 border border-red-100 p-4 rounded-2xl flex-row gap-3">
                <AlertCircle size={18} color="#ef4444" />
                <View className="flex-1">
                  <Text className="text-red-600 font-black text-xs uppercase mb-1">Promo Locked</Text>
                  <Text className="text-red-400 text-[10px] font-bold">Balances over 2,000 Coins cannot use vouchers.</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View className="px-6" style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
        {step === 1 ? (
          <TouchableOpacity 
            onPress={() => setStep(2)}
            className="bg-slate-950 flex-row items-center justify-center py-5 rounded-[2rem]"
          >
            <Text className="text-white font-black text-lg mr-2">Next</Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <View className="bg-slate-900 h-20 rounded-full flex-row items-center p-2 relative overflow-hidden">
            <View className="absolute inset-0 items-center justify-center">
               <Text className="text-white/30 font-black tracking-widest uppercase text-xs">Slide to Dispatch</Text>
            </View>
            <Animated.View 
              {...panResponder.panHandlers}
              style={{ transform: [{ translateX: pan }] }}
              className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center shadow-lg z-10"
            >
              <ArrowRight size={28} color="white" />
            </Animated.View>
          </View>
        )}
      </View>
    </View>
  );
}