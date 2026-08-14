import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '../constants/categories';
import { addExpense } from '../services/mockExpenses';
import FormField from '../components/FormField';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function NuevoGastoScreen() {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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

    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      newErrors.amount = 'Ingresá un monto válido mayor a cero';
    }

    if (!category) {
      newErrors.category = 'Seleccioná una categoría';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateMidnight = new Date(date);
    selectedDateMidnight.setHours(0, 0, 0, 0);

    if (selectedDateMidnight > today) {
      newErrors.date = 'La fecha no puede ser futura';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const formattedDate = date.toISOString().split('T')[0];

    addExpense({
      title: title.trim(),
      amount: numericAmount,
      category,
      date: formattedDate,
      note: note.trim() || null
    }).then(() => {
      setIsSubmitting(false);
      Alert.alert('Éxito', 'El gasto ha sido guardado correctamente', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    });
  };

  const formattedDateDisplay = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
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

        {/* Date Picker */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Fecha</Text>
          {Platform.OS === 'ios' ? (
            <View style={styles.iosDatePickerContainer}>
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  if (selectedDate) setDate(selectedDate);
                }}
                maximumDate={new Date()}
              />
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.datePickerButton} 
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.datePickerText}>{formattedDateDisplay}</Text>
            </TouchableOpacity>
          )}

          {showDatePicker && Platform.OS === 'android' && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
              maximumDate={new Date()}
            />
          )}
          {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
        </View>

        <FormField
          label="Nota (opcional)"
          value={note}
          onChangeText={setNote}
          placeholder="Detalles adicionales..."
          multiline={true}
        />

        <View style={styles.buttonsRow}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => router.back()}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
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
  datePickerButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE1E5',
    borderRadius: 8,
    padding: 12,
  },
  datePickerText: {
    fontSize: 15,
    color: '#2C3E50',
  },
  iosDatePickerContainer: {
    alignItems: 'flex-start',
  },
  errorText: {
    fontSize: 13,
    color: '#E74C3C',
    marginTop: 6,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE1E5',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4A90D9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
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
