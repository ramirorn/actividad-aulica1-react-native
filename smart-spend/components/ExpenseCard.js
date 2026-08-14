// Reusable expense card component.
// Displays category icon, title, formatted date and amount in a single row.
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getCategoryByKey } from '../constants/categories';

/**
 * @param {Object} props
 * @param {string} props.title - Expense title.
 * @param {number} props.amount - Expense amount.
 * @param {string} props.category - Category key (e.g. "food").
 * @param {string} props.date - ISO date string (e.g. "2026-08-13").
 * @param {function} props.onPress - Callback when the card is pressed.
 */
export default function ExpenseCard({ title, amount, category, date, onPress }) {
  const categoryData = getCategoryByKey(category);
  const icon = categoryData ? categoryData.icon : '📦';

  // Format the date as "dd/mm/yyyy".
  const formattedDate = formatDate(date);

  // Format amount as Argentine peso currency.
  const formattedAmount = formatCurrency(amount);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      <Text style={styles.amount}>{formattedAmount}</Text>
    </TouchableOpacity>
  );
}

/**
 * Formats an ISO date string into dd/mm/yyyy.
 * @param {string} isoDate
 * @returns {string}
 */
function formatDate(isoDate) {
  const parts = isoDate.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Formats a number as Argentine peso currency (e.g. $3.500).
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {
  return '$' + value.toLocaleString('es-AR');
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 3,
  },
  date: {
    fontSize: 13,
    color: '#95A5A6',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
});
