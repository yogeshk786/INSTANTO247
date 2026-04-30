// src/store/useStore.js
import { create } from 'zustand';

export const useStore = create((set) => ({
  // --- UI State ---
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  language: 'English',
  toggleLanguage: () => set((state) => ({ 
    language: state.language === 'English' ? 'Hinglish' : 'English' 
  })),

  // --- User & Financial State ---
  coins: 50000,
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  deductCoins: (amount) => set((state) => ({ coins: Math.max(0, state.coins - amount) })),
  
  hasYearlyInsurance: false,
  setYearlyInsurance: (status) => set({ hasYearlyInsurance: status }),

  // --- Cart & Booking State ---
  cart: [],
  addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),
  clearCart: () => set({ cart: [] }),
  
  bookings: [],
  addBooking: (booking) => set((state) => ({ 
    bookings: [booking, ...state.bookings] 
  })),
  updateBooking: (id, updates) => set((state) => ({
    bookings: state.bookings.map(b => b.id === id ? { ...b, ...updates } : b)
  })),
}));