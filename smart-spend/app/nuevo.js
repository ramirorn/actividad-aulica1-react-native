import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '../constants/categories';
import { addExpense } from '../services/mockExpenses';
import FormField from '../components/FormField';

export default function NuevoGastoScreen() {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(() => {
    // default to today YYYY-MM-DD
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [note, setNote] = useState('');

  // Error states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    // Validation
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }

    const numericAmount = parseFloat(amount.replace(',', '.')); // handle comma if user types it
    if (isNaN(numericAmount) || numericAmount <= 0) {
      newErrors.amount = 'Ingresá un monto válido mayor a cero';
    }

    if (!category) {
      newErrors.category = 'Seleccioná una categoría';
    }

    // Basic date validation YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      newErrors.date = 'El formato debe ser YYYY-MM-DD';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const [y, m, d] = date.split('-');
      const localInputDate = new Date(y, m - 1, d);

      if (localInputDate > today) {
        newErrors.date = 'La fecha no puede ser futura';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    addExpense({
      title: title.trim(),
      amount: numericAmount,
      category,
      date,
      note: note.trim() || null
    }).then(() => {
      setIsSubmitting(false);
      Alert.alert('Éxito', 'El gasto ha sido guardado correctamente', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.screen} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <FormField
          label="Título"
          value={title}
          onChangeText={setTitle}
          placeholder="Ej: Almuerzo"
          error={errors.title}
        />

        <FormField
          label="Monto ($)"
          value={amount}
          onChangeText={setAmount}
          placeholder="Ej: 1500"
          keyboardType="numeric"
          error={errors.amount}
        />

        {/* Category Selector */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.categoriesWrapper}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryChip,
                  category === cat.key && styles.categoryChipSelected
                ]}
                onPress={() => setCategory(cat.key)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryChipIcon}>{cat.icon}</Text>
                <Text style={[
                  styles.categoryChipText,
                  category === cat.key && styles.categoryChipTextSelected
                ]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}
        </View>

        <FormField
          label="Fecha (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          placeholder="2026-08-14"
          error={errors.date}
        />

        <FormField
          label="Nota (opcional)"
          value={note}
          onChangeText={setNote}
          placeholder="Detalles adicionales..."
          multiline={true}
        />

        <TouchableOpacity 
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? 'Guardando...' : 'Guardar Gasto'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  categoriesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE1E5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  categoryChipSelected: {
    backgroundColor: '#4A90D9',
    borderColor: '#4A90D9',
  },
  categoryChipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    color: '#2C3E50',
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 13,
    color: '#E74C3C',
    marginTop: 6,
  },
  saveButton: {
    backgroundColor: '#4A90D9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#95A5A6',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
