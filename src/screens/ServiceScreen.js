import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function ServiceScreen({ route }) {
  const { service } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{service.name}</Text>
      <Text style={styles.desc}>Book a trusted {service.name.toLowerCase()} now!</Text>

      <Button title="Book Now" onPress={() => alert("Booking Started")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: '700' },
  desc: { marginVertical: 20, fontSize: 16 }
});
