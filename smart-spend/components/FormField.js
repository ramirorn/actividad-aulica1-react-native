// Reusable form field component.
// Renders a label, a TextInput and an optional error message in red.
import { View, Text, TextInput, StyleSheet } from 'react-native';

/**
 * @param {Object} props
 * @param {string} props.label - Label text above the input.
 * @param {string} props.value - Current input value.
 * @param {function} props.onChangeText - Callback when text changes.
 * @param {string} [props.error] - Validation error message (shown in red if present).
 * @param {string} [props.placeholder] - Placeholder text for the input.
 * @param {string} [props.keyboardType="default"] - Keyboard type ("default", "numeric").
 * @param {boolean} [props.multiline=false] - Whether the input supports multiple lines.
 */
export default function FormField({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  keyboardType = 'default',
  multiline = false,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          error ? styles.inputError : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#BDC3C7"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE1E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#2C3E50',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  errorText: {
    fontSize: 13,
    color: '#E74C3C',
    marginTop: 4,
  },
});
