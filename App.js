import './global.css'; 
import React from 'react';
import { View, Text, TextInput } from 'react-native'; // 🚨 ADDED Text & TextInput
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Your custom navigation setup
import AppNavigator from './src/navigation/AppNavigator';

// 🚨 FIX 1: PREVENT ANDROID FONT SCALING FROM BREAKING YOUR UI 🚨
if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false; 
}

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}

export default function App() {
  console.log("🚨🚨🚨 APP.JS IS FINALLY RUNNING! 🚨🚨🚨");
  
  return (
    // The main wrapper ensuring the background color matches your app's theme
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}> 
       
       {/* Handles modern screen cutouts (notches, dynamic islands) */}
       <SafeAreaProvider>
          
          {/* The engine that manages your screen transitions */}
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>

       </SafeAreaProvider>

    </View>
  );
}