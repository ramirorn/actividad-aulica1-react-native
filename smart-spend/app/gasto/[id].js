// Expense detail screen — displays all fields for a single expense.
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getExpenseById } from '../../services/mockExpenses';
import { getCategoryByKey } from '../../constants/categories';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getExpenseById(id).then((data) => {
      if (data) {
        setExpense(data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });
  }, [id]);

  // --- Loading state ---
  if (loading) {
    return <LoadingSpinner message="Cargando detalle..." />;
  }

  // --- Error state (not found) ---
  if (notFound) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorMessage}>Gasto no encontrado</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>Volver al listado</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Resolve category metadata.
  const categoryData = getCategoryByKey(expense.category);
  const categoryIcon = categoryData ? categoryData.icon : '📦';
  const categoryLabel = categoryData ? categoryData.label : 'Otros';

  // Format date as dd/mm/yyyy.
  const dateParts = expense.date.split('-');
  const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

  // Format amount as currency.
  const formattedAmount = '$' + expense.amount.toLocaleString('es-AR');

  // --- Content state ---
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {/* Amount header */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Monto</Text>
          <Text style={styles.amountValue}>{formattedAmount}</Text>
        </View>

        {/* Detail rows */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Título</Text>
          <Text style={styles.detailValue}>{expense.title}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Categoría</Text>
          <Text style={styles.detailValue}>{categoryIcon}  {categoryLabel}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fecha</Text>
          <Text style={styles.detailValue}>{formattedDate}</Text>
        </View>

        {expense.note ? (
          <>
            <View style={styles.separator} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nota</Text>
              <Text style={styles.detailValue}>{expense.note}</Text>
            </View>
          </>
        ) : null}
      </View>

      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>← Volver al listado</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  amountSection: {
    backgroundColor: '#4A90D9',
    padding: 24,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: '#D6E8F7',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#95A5A6',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: '#2C3E50',
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ECF0F1',
    marginHorizontal: 16,
  },
  errorIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 18,
    color: '#95A5A6',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#4A90D9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
