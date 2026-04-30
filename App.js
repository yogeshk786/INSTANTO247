// App.js
import './global.css'; // <-- ADD THIS LINE
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}> 
       <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
       </SafeAreaProvider>
    </View>
  );
}