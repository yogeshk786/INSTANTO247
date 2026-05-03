// src/screens/AuthScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, 
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
  Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, ChevronRight, ChevronLeft, Lock } from 'lucide-react-native';

// --- PRODUCTION FIREBASE IMPORTS ---
import { auth } from '../config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, signInAnonymously } from 'firebase/auth';

export default function AuthScreen() {
  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmResult, setConfirmResult] = useState(null);

  // --- ANIMATION VALUES ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  // --- TRIGGER LOGO ANIMATION ON LOAD ---
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const notifyUser = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web' && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      } catch (error) {
        console.error("Recaptcha Init Error:", error);
      }
    }
  }, []);

  // --- FUNCTION 1: SEND OTP ---
  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) return;
    setIsLoading(true);

    // 1. MOBILE BYPASS (Expo Go)
    if (Platform.OS !== 'web') {
      // Simulate network delay, then show OTP screen. (DO NOT log in here).
      setTimeout(() => {
        setIsLoading(false);
        setStep(2); 
        notifyUser("Instanto Beta", "Bypassing SMS for Android testing. Use any 6 digits to login.");
      }, 800);
      return; 
    }

    // 2. REAL WEB FIREBASE SMS
    try {
      const formattedPhone = `+91${phoneNumber}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmResult(confirmation);
      setStep(2);
    } catch (error) {
      console.error("SMS Error:", error);
      notifyUser("Delivery Failed", "Could not send OTP. Please check your number and try again.");
      
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(widgetId => {
          window.grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNCTION 2: VERIFY OTP ---
  const handleVerifyOTP = async () => {
    if (otp.length < 6) return;
    setIsLoading(true);

    try {
      // 1. MOBILE BYPASS LOGIN (Expo Go)
      if (Platform.OS !== 'web') {
        setIsLoading(false);
        // This triggers the AppNavigator to automatically show MainTabs
        await signInAnonymously(auth); 
        notifyUser("Success", "Bypass Verified! Welcome to Instanto.");
        return;
      }

      // 2. REAL WEB VERIFICATION
      if (!confirmResult) {
        setIsLoading(false);
        return;
      }

      // This updates Firebase Auth and triggers the AppNavigator automatically
      await confirmResult.confirm(otp);
      
      setPhoneNumber('');
      setOtp('');
      setStep(1);
      
    } catch (error) {
      console.error("Verification Error:", error);
      notifyUser("Invalid Code", "The code you entered is incorrect.");
      setOtp(''); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        
        {/* 🚨 KEYBOARD PERSIST FIX ADDED HERE 🚨 */}
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <View nativeID="recaptcha-container" />

          {/* --- TOP HERO SECTION --- */}
          <View className="w-full h-[40%] bg-slate-900 relative overflow-hidden flex items-center justify-center">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1000' }}
              className="w-full h-full opacity-40 absolute"
            />
            <View className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            
            <Animated.View 
              style={{ 
                opacity: fadeAnim, 
                transform: [{ scale: scaleAnim }],
                alignItems: 'center',
                marginBottom: 40 
              }}
            >
              <View className="w-24 h-24 bg-orange-500 rounded-3xl items-center justify-center shadow-2xl border-2 border-white/20">
                <Text className="text-white text-5xl font-black italic">i</Text>
              </View>
            </Animated.View>

            {step === 2 && (
              <TouchableOpacity 
                onPress={() => setStep(1)}
                disabled={isLoading}
                className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center border border-white/10"
              >
                <ChevronLeft size={24} color="#ffffff" />
              </TouchableOpacity>
            )}

            <View className="absolute bottom-8 left-6 right-6">
              <View className="bg-orange-500 self-start px-3 py-1.5 rounded-full mb-3 shadow-sm">
                <Text className="text-white font-black text-xs uppercase tracking-widest">
                  {step === 1 ? 'Instanto Premium' : 'Secure Login'}
                </Text>
              </View>
              <Text className="text-4xl font-black text-white tracking-tighter leading-tight">
                {step === 1 ? "India's Fastest\nHome Services." : "Enter your\n6-digit code."}
              </Text>
            </View>
          </View>

          {/* --- BOTTOM INTERACTIVE FORM --- */}
          <View className="flex-1 px-6 pt-8 pb-6 bg-white rounded-t-[2rem] -mt-6">
            <Text className="text-slate-500 font-medium text-base mb-8">
              {step === 1 
                ? "Log in or sign up to view your wallet balance and book instant repairs."
                : `We've sent a secure SMS to +91 ${phoneNumber}`
              }
            </Text>

            {step === 1 && (
              <View className="mb-8">
                <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-3">Mobile Number</Text>
                <View className="flex-row items-center border-b-2 border-slate-200 pb-2 focus-within:border-orange-500 transition-colors">
                  <View className="flex-row items-center pr-3 border-r border-slate-200 mr-3">
                    <Image 
                      source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png' }}
                      className="w-6 h-4 rounded-sm mr-2"
                    />
                    <Text className="text-slate-900 font-bold text-lg">+91</Text>
                  </View>
                  <TextInput
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))} 
                    placeholder="98765 43210"
                    placeholderTextColor="#cbd5e1"
                    keyboardType="phone-pad"
                    maxLength={10}
                    editable={!isLoading}
                    className="flex-1 text-2xl font-black text-slate-900 h-12"
                    // 🚨 ANDROID STRING CRASH FIX 🚨
                    style={{ letterSpacing: Platform.OS === 'android' ? 1 : 0 }}
                  />
                  {phoneNumber.length === 10 && !isLoading && (
                    <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center">
                      <ShieldCheck size={14} color="#16a34a" />
                    </View>
                  )}
                  {isLoading && <ActivityIndicator size="small" color="#f97316" />}
                </View>
              </View>
            )}

            {step === 2 && (
              <View className="mb-8">
                <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-3">Verification Code</Text>
                <View className="flex-row items-center border-b-2 border-slate-200 pb-2 focus-within:border-orange-500 transition-colors">
                  <Lock size={20} color="#94a3b8" className="mr-3" />
                  <TextInput
                    value={otp}
                    onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))}
                    placeholder="• • • • • •"
                    placeholderTextColor="#cbd5e1"
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus={true}
                    editable={!isLoading}
                    className="flex-1 text-3xl font-black text-slate-900 h-12"
                    // 🚨 ANDROID STRING CRASH FIX 🚨
                    style={{ letterSpacing: Platform.OS === 'android' ? 15 : 20 }}
                  />
                  {isLoading && <ActivityIndicator size="small" color="#f97316" />}
                </View>
              </View>
            )}

            <View className="flex-1 justify-end mt-4">
              <Text className="text-center text-slate-400 text-[10px] font-medium mb-4 px-4 leading-relaxed">
                By continuing, you agree to our Terms of Service & Privacy Policy.
              </Text>
              
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={step === 1 ? handleSendOTP : handleVerifyOTP}
                disabled={(step === 1 && phoneNumber.length < 10) || (step === 2 && otp.length < 6) || isLoading}
                className={`flex-row items-center justify-center py-4 rounded-2xl shadow-sm 
                  ${((step === 1 && phoneNumber.length === 10) || (step === 2 && otp.length === 6)) 
                    ? 'bg-orange-500' : 'bg-slate-100'}`}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text className={`font-black text-lg mr-2 ${((step === 1 && phoneNumber.length === 10) || (step === 2 && otp.length === 6)) ? 'text-white' : 'text-slate-400'}`}>
                      {step === 1 ? 'Get OTP' : 'Verify & Login'}
                    </Text>
                    <ChevronRight size={20} color={((step === 1 && phoneNumber.length === 10) || (step === 2 && otp.length === 6)) ? '#fff' : '#94a3b8'} />
                  </>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}