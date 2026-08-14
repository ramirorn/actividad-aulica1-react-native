import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getExpensesByCategory } from '../services/mockExpenses';
import CategoryBar from '../components/CategoryBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function CategoriasScreen() {
  const router = useRouter();
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load summary on mount and every time screen gains focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getExpensesByCategory().then((data) => {
        // data object: { [categoryKey]: { total, percentage } }
        
        // Convert to array and sort by total descending
        const sortedArray = Object.keys(data)
          .map((key) => ({
            key,
            ...data[key],
          }))
          .sort((a, b) => b.total - a.total);

        setCategoriesData(sortedArray);
        setLoading(false);
      });
    }, [])
  );

  // Calculate grand total from the sorted array
  const grandTotal = categoriesData.reduce((sum, cat) => sum + cat.total, 0);
  const formattedGrandTotal = '$' + grandTotal.toLocaleString('es-AR');

  // --- Loading state ---
  if (loading) {
    return <LoadingSpinner message="Calculando resumen..." />;
  }

  // --- Empty state ---
  if (categoriesData.length === 0) {
    return (
      <View style={styles.screen}>
        <EmptyState icon="📊" message="No hay datos de categorías todavía" />
        <TouchableOpacity
          style={styles.backButtonEmpty}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>← Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Content state ---
  return (
    <View style={styles.screen}>
      {/* Total summary header */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Gasto Total</Text>
        <Text style={styles.totalAmount}>{formattedGrandTotal}</Text>
      </View>

      {/* Category list */}
      <FlatList
        data={categoriesData}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <CategoryBar
            label={item.label}
            icon={item.icon}
            total={item.total}
            percentage={item.percentage}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom back button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>← Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  totalCard: {
    backgroundColor: '#4A90D9',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  totalLabel: {
    fontSize: 14,
    color: '#D6E8F7',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F7FA',
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
  },
  backButton: {
    backgroundColor: '#4A90D9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backButtonEmpty: {
    backgroundColor: '#4A90D9',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
