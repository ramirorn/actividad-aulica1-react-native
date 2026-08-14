// Reusable empty state component.
// Displays a large icon and a descriptive message centered on screen.
import { View, Text, StyleSheet } from 'react-native';

/**
 * @param {Object} props
 * @param {string} props.icon - Emoji or icon character to display.
 * @param {string} props.message - Descriptive message for the empty state.
 */
export default function EmptyState({ icon, message }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 32,
  },
  icon: {
    fontSize: 56,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 24,
  },
});
