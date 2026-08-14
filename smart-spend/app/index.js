// Dashboard screen — displays the expense list with total and navigation.
import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getExpenses } from '../services/mockExpenses';
import ExpenseCard from '../components/ExpenseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function DashboardScreen() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load expenses on mount and every time the screen gains focus.
  const loadExpenses = useCallback(() => {
    setLoading(true);
    getExpenses().then((data) => {
      setExpenses(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // Calculate accumulated total from all expenses.
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const formattedTotal = '$' + total.toLocaleString('es-AR');

  // --- Loading state ---
  if (loading) {
    return <LoadingSpinner message="Cargando gastos..." />;
  }

  // --- Empty state ---
  if (expenses.length === 0) {
    return (
      <View style={styles.screen}>
        <EmptyState icon="📝" message="Aún no tenés gastos registrados" />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/nuevo')}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+ Agregar gasto</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Content state ---
  return (
    <View style={styles.screen}>
      {/* Total summary header */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total acumulado</Text>
        <Text style={styles.totalAmount}>{formattedTotal}</Text>
      </View>

      {/* Expense list */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseCard
            title={item.title}
            amount={item.amount}
            category={item.category}
            date={item.date}
            onPress={() => router.push(`/gasto/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom navigation buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/categorias')}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>📊 Categorías</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/nuevo')}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+ Nuevo gasto</Text>
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
    padding: 20,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#D6E8F7',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F7FA',
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
    gap: 10,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#4A90D9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE1E5',
  },
  secondaryButtonText: {
    color: '#2C3E50',
    fontSize: 15,
    fontWeight: '600',
  },
});
