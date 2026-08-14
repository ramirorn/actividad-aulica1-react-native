// Reusable loading spinner component.
// Displays a centered ActivityIndicator with an optional message below.
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * @param {Object} props
 * @param {string} [props.message="Cargando..."] - Optional text shown below the spinner.
 */
export default function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4A90D9" />
      {message ? <Text style={styles.message}>{message}</Text> : null}
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
  message: {
    marginTop: 12,
    fontSize: 15,
    color: '#7F8C8D',
  },
});
