// src/constants/data.js
import { 
  Wind, Tv, Zap, Sparkles, Fan, ChefHat, Waves, 
  Droplets, Sun, Hammer, Paintbrush, Car, ShieldCheck 
} from 'lucide-react-native';

export const COIN_VALUE_INR = 0.01; // 1 Coin = 0.01 INR
export const MAX_DISCOUNT_INR = 100; 

export const LOCAL_NEIGHBORHOODS = [
  "Vaishali Nagar, Jaipur", 
  "Sardarpura, Jodhpur", 
  "Civil Lines, Ajmer", 
  "Andheri West, Mumbai"
];

export const TIME_SLOTS = ["07:00 AM", "09:30 AM", "12:00 PM", "04:30 PM", "07:00 PM"];
export const SHOP_CATEGORIES = ['All', 'Cooling', 'Spares', 'Power', 'Water', 'Protection'];

// --- Main Services ---
export const SERVICES = [
  { id: 'ac', name: 'AC Repair & Service', hasWarranty: true, icon: Wind, color: 'cyan', price: 299, rating: 4.8, reviews: 924, duration: '45-90 min', description: 'Deep foam cleaning, gas top-up, and cooling efficiency check.', image: 'https://images.unsplash.com/photo-1527629525381-817822b3b0d7?auto=format&fit=crop&q=80&w=600' },
  { id: 'install', name: 'TV & Appliance Setup', hasWarranty: true, icon: Tv, color: 'purple', price: 299, rating: 4.9, reviews: 312, duration: '30 min', description: "Instant unboxing & wall mounting. Don't wait 48 hours for the brand!", image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=600' },
  { id: 'elec', name: 'Electrician', pricingType: 'hourly', hasWarranty: true, icon: Zap, color: 'indigo', price: 149, rating: 4.8, reviews: 124, duration: 'Billed per hour', description: 'Specialized in wiring, circuit fixes, and appliance setup.', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600' },
  { id: 'maid', name: 'Deep Cleaning', icon: Sparkles, color: 'blue', price: 599, rating: 4.9, reviews: 450, duration: '120-180 min', description: 'Hospital-grade sanitization and organizational service.', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600' },
  { id: 'cool', name: 'Desert Cooler', hasWarranty: true, icon: Fan, color: 'sky', price: 149, rating: 4.9, reviews: 842, duration: '30-45 min', description: 'Pad replacement, motor oiling, and deep tank cleaning.', image: 'https://images.unsplash.com/photo-1591136611599-974268e54737?auto=format&fit=crop&q=80&w=600' },
  { id: 'cook', name: 'Cook for a Day', icon: ChefHat, color: 'rose', price: 299, rating: 4.7, reviews: 89, duration: '90 min', description: 'Custom meal preparation for small gatherings or daily needs.', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=600' },
  { id: 'tank', name: 'Tank Cleaning', icon: Waves, color: 'cyan', price: 399, rating: 4.8, reviews: 320, duration: '60-90 min', description: 'UV sanitization and high-pressure sludge removal.', image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=600' },
  { id: 'plum', name: 'Plumbing', pricingType: 'hourly', hasWarranty: true, icon: Droplets, color: 'teal', price: 149, rating: 4.8, reviews: 245, duration: 'Billed per hour', description: 'Leak fixes, pipe installations, and bathroom fittings.', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600' },
  { id: 'solar', name: 'Solar Panel Wash', icon: Sun, color: 'orange', price: 299, rating: 4.9, reviews: 412, duration: '45 min', description: 'Boost electricity generation by 25% instantly. Microfiber & RO water clean.', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600' },
  { id: 'carp', name: 'Carpenter', pricingType: 'hourly', hasWarranty: true, icon: Hammer, color: 'amber', price: 199, rating: 4.7, reviews: 188, duration: 'Billed per hour', description: 'Furniture assembly, door fixes, and custom woodwork.', image: 'https://images.unsplash.com/photo-1581147036324-c1e19ebf40f3?auto=format&fit=crop&q=80&w=600' },
  { id: 'pain', name: 'Painter', hasWarranty: true, icon: Paintbrush, color: 'pink', price: 899, rating: 4.9, reviews: 289, duration: '4-8 hours', description: 'Interior & exterior painting, wall touch-ups, and texturing.', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600' },
  { id: 'carc', name: 'Car Cleaning', icon: Car, color: 'blue', price: 299, rating: 4.8, reviews: 342, duration: '45-90 min', description: 'Exterior foam wash, interior vacuuming, and dashboard polishing.', image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=600' }
];

// --- Trojan Horse / Loss Leader Micro-Services ---
export const TROJAN_SERVICES = [
  { id: 't1', name: '10-Point AC Health Check', icon: ShieldCheck, color: 'orange', price: 49, rating: 4.9, reviews: 1240, duration: '15 min', description: 'Complete gas, filter & cooling inspection. ₹49 adjusted in repair bill.', image: 'https://images.unsplash.com/photo-1527629525381-817822b3b0d7?auto=format&fit=crop&q=80&w=600', pricingType: 'fixed' },
  { id: 't2', name: 'RO TDS Purity Test', icon: Droplets, color: 'blue', price: 49, rating: 4.8, reviews: 856, duration: '10 min', description: 'Digital TDS meter test & basic filter cleaning. ₹49 adjusted in repair bill.', image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=600', pricingType: 'fixed' }
];

// --- Tier 2/3 Localized Marketplace Products ---
export const PRODUCTS = [
  { id: 'p1', name: 'Honeycomb Pads (Set of 3)', price: 449, category: 'Cooling', image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=400', desc: 'High-density cooling pads for major brands.' },
  { id: 'p2', name: 'Premium Wood-wool Grass', price: 89, category: 'Cooling', image: 'https://images.unsplash.com/photo-1591136611599-974268e54737?auto=format&fit=crop&q=80&w=400', desc: 'Traditional high-absorbent grass for desert coolers.' },
  { id: 'p3', name: 'Heavy Duty Submersible Pump', price: 249, category: 'Spares', image: 'https://images.unsplash.com/photo-1585938389612-a552a28d6914?auto=format&fit=crop&q=80&w=400', desc: 'Powerful 18W pump for large coolers.' },
  { id: 'p4', name: 'Inverter Battery Fluid (5L)', price: 99, category: 'Power', image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400', desc: 'Distilled water with anti-corrosion tech.' },
  { id: 'p5', name: 'Universal AC Remote', price: 299, category: 'Spares', image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&q=80&w=400', desc: 'Works with Voltas, LG, Lloyd, Daikin & more. LCD display.' },
  { id: 'p6', name: '45 MFD AC Capacitor', price: 349, category: 'Spares', image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=400', desc: 'Heavy duty dual run capacitor for 1.5 & 2 Ton ACs.' },
  { id: 'p7', name: 'Copper Pipe (3m) & Insulation', price: 1299, category: 'Cooling', image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400', desc: '100% pure copper piping with anti-sweat nitrile insulation.' },
  { id: 'p8', name: 'AC Dust Filter Mesh', price: 199, category: 'Protection', image: 'https://images.unsplash.com/photo-1527629525381-817822b3b0d7?auto=format&fit=crop&q=80&w=400', desc: 'Washable anti-bacterial PM 2.5 filter mesh replacement.' },
];

export const FESTIVE_OFFERS = [
  { id: 'f1', title: 'Festive Mega Sale', subtitle: 'Flat ₹100 OFF on Deep Cleaning', code: 'CLEAN100', color: 'from-orange-500 to-rose-500', type: 'flat', val: 100 },
  { id: 'f2', title: 'Summer AC Prep', subtitle: '15% OFF on AC Servicing', code: 'COOL15', color: 'from-blue-500 to-cyan-500', type: 'percent', val: 15 },
];

export const SUBSCRIPTIONS = [
  { id: 'sub_clean', title: 'Monthly Home Cleaning', price: 999, icon: Sparkles, color: 'from-blue-600 to-cyan-500', shadow: 'shadow-blue-200', features: ['2 Deep Cleanings / mo', 'Bathroom Sanitization', 'Full Dusting & Mopping'] },
  { id: 'sub_raj', title: 'Thanda Ghar Membership', price: 699, icon: Wind, color: 'from-sky-500 to-blue-600', shadow: 'shadow-sky-200', features: ['3 Cooler/AC Services', 'Priority Dispatch in Heatwaves', 'Free Spare Delivery'] },
  { id: 'sub_solar', title: 'Surya Shield AMC', price: 1199, icon: Sun, color: 'from-amber-500 to-orange-600', shadow: 'shadow-orange-200', features: ['4 Quarterly Deep Cleans', '1 Emergency Aandhi Wash', 'Live Inverter Output Proof'] }
];

// For the infinite scroll effect in the UI
export const EXTENDED_SUBSCRIPTIONS = [...SUBSCRIPTIONS, ...SUBSCRIPTIONS, ...SUBSCRIPTIONS, ...SUBSCRIPTIONS];

export const MONTHLY_PACKAGES = [
  { id: 'pkg_clean', title: '1-Month Deep Cleaning', price: 1499, icon: Sparkles, color: 'from-indigo-500 to-purple-600', features: ['4 Weekly Deep Cleans', 'Bathroom Sanitization', 'Kitchen Degreasing'] },
  { id: 'pkg_cook', title: '1-Month Daily Cook', price: 2999, icon: ChefHat, color: 'from-rose-500 to-orange-500', features: ['Daily 2 Meals (Mon-Sat)', 'Custom Diet Plans', 'Grocery Management'] }
];