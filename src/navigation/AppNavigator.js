// src/navigation/AppNavigator.js
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, History, CreditCard, ShoppingBag, User } from 'lucide-react-native';

// --- Real Screens ---
import HomeScreen from '../screens/HomeScreen';

// --- Temporary Placeholder Screens ---
const ActivityScreen = () => <View style={styles.screen}><Text className="text-lg font-black text-slate-900">Activity Screen</Text></View>;
const WalletScreen = () => <View style={styles.screen}><Text className="text-lg font-black text-slate-900">Wallet Screen</Text></View>;
const StoreScreen = () => <View style={styles.screen}><Text className="text-lg font-black text-slate-900">Store Screen</Text></View>;
const ProfileScreen = () => <View style={styles.screen}><Text className="text-lg font-black text-slate-900">Profile Screen</Text></View>;

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#0f172a', // text-slate-900
        tabBarInactiveTintColor: '#94a3b8', // text-slate-400
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 16,
          right: 16,
          elevation: 10,
          backgroundColor: '#0f172a', // bg-slate-900
          borderRadius: 24,
          height: 72,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIcon: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    // Web safe shadows
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