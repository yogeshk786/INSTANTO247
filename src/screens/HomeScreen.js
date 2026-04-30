import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const services = [
  { id: 1, name: "Electrician", icon: require('../assets/electrician.png') },
  { id: 2, name: "Plumber", icon: require('../assets/plumber.png') },
  { id: 3, name: "Mobile Repair", icon: require('../assets/mobile.png') },
  { id: 4, name: "Lappair", icon: require('../assets/laptop.png') },
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instant Home Services</Text>

      <View style={styles.grid}>
        {services.map(service => (
          <TouchableOpacity 
            key={service.id} 
            style={styles.card}
            onPress={() => navigation.navigate("ServiceScreen", { service })}
          >
            <Image source={service.icon} style={styles.icon} />
            <Text style={styles.cardText}>{service.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '45%', backgroundColor: '#f9f9f9', padding: 20,
    borderRadius: 12, marginBottom: 20, alignItems: 'center'
  },
  cardText: { marginTop: 10, fontSize: 16, fontWeight: '500' },
  icon: { width: 60, height: 60 }
});
