import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, History, CreditCard, ShoppingBag, User } from 'lucide-react-native';

// Safe Area Insets for dynamic iOS/Android spacing
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Firebase Imports ---
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase'; 

// --- Real Screens ---
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import ServiceDetailScreen from '../screens/ServiceDetailScreen'; 
import ActivityScreen from '../screens/ActivityScreen';
import ProfileScreen from '../screens/ProfileScreen'; 
import BookingOptionsScreen from '../screens/BookingOptionsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

// 🚨 1. TEMPORARILY DISABLED FOR SAFE MODE TEST 🚨
import AddAddressScreen from '../screens/AddAddressScreen';

// --- Temporary Placeholder Screens ---
const WalletScreen = () => <View style={styles.screen}><Text style={styles.placeholderText}>Wallet Screen</Text></View>;
const StoreScreen = () => <View style={styles.screen}><Text style={styles.placeholderText}>Store Screen</Text></View>;

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Your Custom Tab Navigator
function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#0f172a', // slate-900
        tabBarInactiveTintColor: '#94a3b8', // slate-400
        tabBarStyle: {
          backgroundColor: '#0f172a',
          height: Platform.OS === 'ios' ? 85 : 65 + insets.bottom,
          paddingBottom: Platform.OS === 'ios' ? 24 : insets.bottom + 8,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.1)',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '900',
          marginTop: -5,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : null}>
              <Home color={focused ? '#0f172a' : color} size={22} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }} 
      />
      <Tab.Screen 
        name="Activity" 
        component={ActivityScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : null}>
              <History color={focused ? '#0f172a' : color} size={22} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }} 
      />
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : null}>
              <CreditCard color={focused ? '#0f172a' : color} size={22} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }} 
      />
      <Tab.Screen 
        name="Store" 
        component={StoreScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : null}>
              <ShoppingBag color={focused ? '#0f172a' : color} size={22} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : null}>
              <User color={focused ? '#0f172a' : color} size={22} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }} 
      />
    </Tab.Navigator>
  );
}

// 2. The Master Navigator with Firebase State
export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false); 
    });

    return unsubscribe; 
  }, []);

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          {/* Main App Experience */}
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          
          {/* Full Page Overlays */}
          <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
          <Stack.Screen name="BookingOptions" component={BookingOptionsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          
          {/* 🚨 2. TEMPORARILY DISABLED FOR SAFE MODE TEST 🚨 */}
          <Stack.Screen name="AddAddress" component={AddAddressScreen} />
        </>
      ) : (
        /* Unauthenticated Experience */
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  activeIcon: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...Platform.select({
      web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    })
  }
});