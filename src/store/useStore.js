// src/store/useStore.js
import { create } from 'zustand';

export const useStore = create((set) => ({
  // 1. Language System
  language: 'English', 
  setLanguage: (lang) => set({ language: lang }),

  // 2. Wallet System
  coins: 0, 
  addCoins: (amount) => set((state) => ({ coins: (state.coins || 0) + amount })),

  // 3. Insurance System
  hasYearlyInsurance: false,
  setYearlyInsurance: (status) => set({ hasYearlyInsurance: status }),

  // 🚨 4. CART SYSTEM - ADD THIS 🚨
  cart: [],
  
  // This function takes the service object and adds it to the list
  addToCart: (service) => set((state) => ({ 
    cart: [...state.cart, service] 
  })),

  // This removes a service by filtering out its ID
  removeFromCart: (serviceId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== serviceId)
  })),

  // Clear everything after a successful booking
  clearCart: () => set({ cart: [] }),
}));