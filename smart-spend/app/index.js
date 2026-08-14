// Dashboard screen — placeholder for T03 implementation.
// Temporarily imports mockExpenses to verify T02 works at runtime.
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getExpenses } from '../services/mockExpenses';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getExpenses().then((data) => {
      setCount(data.length);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90D9" />
        <Text style={styles.subtitle}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SmartSpend</Text>
      <Text style={styles.subtitle}>
        {count} gastos cargados desde mockExpenses
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
});
