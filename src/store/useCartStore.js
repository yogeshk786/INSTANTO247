// src/store/useCartStore.js
import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cart: [],
  
  // Add a service to the cart (prevents duplicates)
  addToCart: (service) => set((state) => {
    const exists = state.cart.find(item => item.id === service.id);
    if (exists) return state; 
    return { cart: [...state.cart, service] };
  }),

  // Remove a service
  removeFromCart: (serviceId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== serviceId)
  })),

  // Empty the cart after booking
  clearCart: () => set({ cart: [] }),
}));