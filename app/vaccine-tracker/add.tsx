import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const commonVaccines = [
  'Diğer',
  'BCG',
  'Hepatit B',
  'DaBT-İPA-Hib',
  'KPA',
  'OPA',
  'Rota',
  'KKK',
  'Suçiçeği',
  'Hepatit A',

];

export default function AddVaccineScreen() {
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [customVaccine, setCustomVaccine] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleSave = () => {
    // Burada API'ye kayıt işlemi yapılacak
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.formCard}>
          {/* Aşı Seçimi */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Aşı İsmi</ThemedText>
            <TouchableOpacity 
              onPress={() => setShowPicker(true)}
              style={styles.pickerButton}
            >
              <ThemedText style={[
                styles.pickerButtonText,
                !selectedVaccine && styles.placeholderText
              ]}>
                {selectedVaccine || "Aşı Seçin"}
              </ThemedText>
              <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>

            {showPicker && Platform.OS === 'ios' && (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedVaccine}
                  onValueChange={(itemValue) => {
                    setSelectedVaccine(itemValue);
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Aşı Seçin" value="" />
                  {commonVaccines.map(vaccine => (
                    <Picker.Item 
                      key={vaccine} 
                      label={vaccine} 
                      value={vaccine}
                    />
                  ))}
                </Picker>
                <TouchableOpacity 
                  style={styles.pickerDoneButton}
                  onPress={() => setShowPicker(false)}
                >
                  <ThemedText style={styles.pickerDoneButtonText}>Tamam</ThemedText>
                </TouchableOpacity>
              </View>
            )}

            {showPicker && Platform.OS === 'android' && (
              <Picker
                selectedValue={selectedVaccine}
                onValueChange={(itemValue) => {
                  setSelectedVaccine(itemValue);
                  setShowPicker(false);
                }}
                style={styles.androidPicker}
              >
                <Picker.Item label="Aşı Seçin" value="" />
                {commonVaccines.map(vaccine => (
                  <Picker.Item 
                    key={vaccine} 
                    label={vaccine} 
                    value={vaccine}
                  />
                ))}
              </Picker>
            )}
          </View>

          {/* Özel Aşı İsmi */}
          {selectedVaccine === 'Diğer' && (
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Özel Aşı İsmi</ThemedText>
              <TextInput
                style={styles.input}
                value={customVaccine}
                onChangeText={setCustomVaccine}
                placeholder="Aşı ismini girin"
                placeholderTextColor="#999"
              />
            </View>
          )}

          {/* Tarih Seçimi */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Tarih</ThemedText>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <ThemedText style={styles.dateButtonText}>
                {format(selectedDate, 'd MMMM yyyy', { locale: tr })}
              </ThemedText>
              <MaterialIcons name="calendar-today" size={20} color="#666" />
            </TouchableOpacity>
            {showDatePicker && Platform.OS === 'ios' && (
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={(event, date) => {
                    if (date) setSelectedDate(date);
                  }}
                  style={styles.datePicker}
                />
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <ThemedText style={styles.datePickerButtonText}>Tamam</ThemedText>
                </TouchableOpacity>
              </View>
            )}
            {showDatePicker && Platform.OS === 'android' && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setSelectedDate(date);
                }}
              />
            )}
          </View>

          {/* Not */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Not (İsteğe Bağlı)</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={note}
              onChangeText={setNote}
              placeholder="Aşı ile ilgili not ekleyin"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[
          styles.saveButton,
          (!selectedVaccine || (selectedVaccine === 'Diğer' && !customVaccine)) && styles.saveButtonDisabled
        ]}
        onPress={handleSave}
        disabled={!selectedVaccine || (selectedVaccine === 'Diğer' && !customVaccine)}
      >
        <MaterialIcons name="check" size={24} color="#fff" />
        <ThemedText style={styles.saveButtonText}>Kaydet</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  pickerButton: {
    backgroundColor: '#fff',
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  picker: {
    height: 200,
  },
  androidPicker: {
    backgroundColor: '#fff',
    marginTop: 8,
  },
  pickerDoneButton: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  pickerDoneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  dateButton: {
    backgroundColor: '#fff',
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: Colors.light.tint,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  datePicker: {
    height: 200,
  },
  datePickerButton: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  datePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 