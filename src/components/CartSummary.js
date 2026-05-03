// src/components/CartSummary.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ShoppingBag, ChevronRight } from 'lucide-react-native';

// 🚨 1. FIXED: Now importing from your actual cart store!
import { useCartStore } from '../store/useCartStore';
import { useNavigation } from '@react-navigation/native';

const CartSummary = () => {
  // 🚨 2. FIXED: Pulling the cart from the correct hook
  const { cart } = useCartStore();
  const navigation = useNavigation();

  // Hide the bar if nothing is in the cart
  if (!cart || cart.length === 0) return null;

  const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity 
        activeOpacity={0.9}
        // 🚨 3. FIXED: Pointing React Navigation to the nested Tab bar first!
        onPress={() => navigation.navigate('MainTabs', { screen: 'Activity' })}
        style={styles.container}
      >
        <View style={styles.leftSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cart.length}</Text>
          </View>
          <View>
            <Text style={styles.priceText}>₹{totalAmount}</Text>
            <Text style={styles.subText}>VIEW CART</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.ctaText}>Checkout</Text>
          <ChevronRight size={20} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 90, // Sits exactly above your Bottom Tab Bar
    left: 16,
    right: 16,
    zIndex: 999,
  },
  container: {
    backgroundColor: '#0f172a', // Slate-900
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15 },
      android: { elevation: 12 },
    }),
  },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    backgroundColor: '#f97316', // Instanto Orange
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeText: { color: '#fff', fontWeight: '900', fontSize: 12 },
  priceText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  subText: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  rightSection: { flexDirection: 'row', alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '900', fontSize: 16, marginRight: 4 },
});

export default CartSummary;