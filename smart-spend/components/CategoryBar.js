// Reusable category bar component.
// Displays a row with icon, label, total amount and a visual progress bar.
import { View, Text, StyleSheet } from 'react-native';

/**
 * @param {Object} props
 * @param {string} props.label - Category name (e.g. "Alimentación").
 * @param {string} props.icon - Emoji icon for the category.
 * @param {number} props.total - Total amount spent in this category.
 * @param {number} props.percentage - Percentage of grand total (0–100).
 */
export default function CategoryBar({ label, icon, total, percentage }) {
  // Format amount as Argentine peso currency.
  const formattedTotal = '$' + total.toLocaleString('es-AR');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.iconLabel}>
          {icon}  {label}
        </Text>
        <Text style={styles.amount}>{formattedTotal}</Text>
      </View>

      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>

      <Text style={styles.percentage}>{percentage}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },
  amount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#ECF0F1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#4A90D9',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    color: '#95A5A6',
    textAlign: 'right',
  },
});
