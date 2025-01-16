import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Platform, ActivityIndicator, Modal, ActionSheetIOS, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useBabyContext } from '@/context/BabyContext';
import { babyApi } from '@/services/api/baby';

const commonAllergies = [
  'Diğer',
  'Süt',
  'Yumurta',
  'Fıstık',
  'Kuruyemiş',
  'Buğday',
  'Soya',
  'Balık',
  'Kabuklu Deniz Ürünleri',
  'Mısır',
  'Peynir',
  'Çikolata',
  'Bal',
  'Domates',
  'Çilek',
  'Kivi',
  'Portakal',
  'Limon',
  'Gluten',
  'Susam'
];

export default function AddAllergyScreen() {
  const { babies, fetchBabies, loading } = useBabyContext();
  const [selectedBabyId, setSelectedBabyId] = useState('');
  const [selectedAllergy, setSelectedAllergy] = useState('');
  const [customAllergy, setCustomAllergy] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showVaccinePicker, setShowVaccinePicker] = useState(false);
  const [showBabyPicker, setShowBabyPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  const selectedBaby = babies.find(b => b.id === selectedBabyId);

  const handleSave = async () => {
    try {
      if (isSaving) return;
      setIsSaving(true);

      if (!selectedBabyId) {
        Alert.alert('Hata', 'Lütfen bir bebek seçin');
        return;
      }

      if (!selectedAllergy) {
        Alert.alert('Hata', 'Lütfen bir Alerji seçin');
        return;
      }

      if (selectedAllergy === 'Diğer' && !customAllergy) {
        Alert.alert('Hata', 'Lütfen özel Alerji ismini girin');
        return;
      }

      const allergyData = {
        allergy_name: selectedAllergy === 'Diğer' ? customAllergy : selectedAllergy,
        discovery_date: selectedDate,
        symptoms: note || undefined
      };

      const response = await babyApi.addAllergy(selectedBabyId, allergyData);

      if (response.success) {
        await fetchBabies();
        Alert.alert('Başarılı', 'Alerji bilgisi eklendi', [
          { text: 'Tamam', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Hata', response.error?.message || 'Bir hata oluştu');
      }
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Alerji eklenirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </ThemedView>
    );
  }

  if (babies.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.noDataText}>Henüz bebek eklenmemiş</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.formCard}>
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Bebek</ThemedText>
            <TouchableOpacity 
              onPress={() => setShowBabyPicker(true)}
              style={styles.pickerButton}
            >
              <ThemedText style={[
                styles.pickerButtonText,
                !selectedBabyId && styles.placeholderText
              ]}>
                {selectedBaby ? selectedBaby.name : "Bebek Seçin"}
              </ThemedText>
              <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>

            {showBabyPicker && Platform.OS === 'ios' && (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedBabyId}
                  onValueChange={(itemValue) => {
                    setSelectedBabyId(itemValue);
                  }}
                  style={styles.picker}
                >
                  <Picker.Item key="default" label="Bebek Seçin" value="" />
                  {babies.map(baby => (
                    <Picker.Item 
                      key={`baby-${baby.id}`}
                      label={baby.name} 
                      value={baby.id}
                    />
                  ))}
                </Picker>
                <TouchableOpacity 
                  style={styles.pickerDoneButton}
                  onPress={() => setShowBabyPicker(false)}
                >
                  <ThemedText style={styles.pickerDoneButtonText}>Tamam</ThemedText>
                </TouchableOpacity>
              </View>
            )}

            {showBabyPicker && Platform.OS === 'android' && (
              <Picker
                selectedValue={selectedBabyId}
                onValueChange={(itemValue) => {
                  setSelectedBabyId(itemValue);
                  setShowBabyPicker(false);
                }}
                style={styles.androidPicker}
              >
                <Picker.Item label="Bebek Seçin" value="" />
                {babies.map(baby => (
                  <Picker.Item 
                    key={`baby-${baby.id}`}
                    label={baby.name} 
                    value={baby.id}
                  />
                ))}
              </Picker>
            )}
          </View>
          

          {/* Alerji Seçimi */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Alerji İsmi</ThemedText>
            <TouchableOpacity 
              onPress={() => setShowVaccinePicker(true)}
              style={styles.pickerButton}
            >
              <ThemedText style={[
                styles.pickerButtonText,
                !selectedAllergy && styles.placeholderText
              ]}>
                {selectedAllergy || "Alerji Seçin"}
              </ThemedText>
              <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>

            {showVaccinePicker && Platform.OS === 'ios' && (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedAllergy}
                  onValueChange={(itemValue) => {
                    setSelectedAllergy(itemValue);
                  }}
                  style={styles.picker}
                >
                  <Picker.Item key="default" label="Alerji Seçin" value="" />
                  {commonAllergies.map(allergy => (
                    <Picker.Item 
                      key={`allergy-${allergy}`}
                      label={allergy} 
                      value={allergy}
                    />
                  ))}
                </Picker>
                <TouchableOpacity 
                  style={styles.pickerDoneButton}
                  onPress={() => setShowVaccinePicker(false)}
                >
                  <ThemedText style={styles.pickerDoneButtonText}>Tamam</ThemedText>
                </TouchableOpacity>
              </View>
            )}

            {showVaccinePicker && Platform.OS === 'android' && (
              <Picker
                selectedValue={selectedAllergy}
                onValueChange={(itemValue) => {
                  setSelectedAllergy(itemValue);
                  setShowVaccinePicker(false);
                }}
                style={styles.androidPicker}
              >
                <Picker.Item label="Alerji Seçin" value="" />
                {commonAllergies.map(vaccine => (
                  <Picker.Item 
                    key={vaccine} 
                    label={vaccine} 
                    value={vaccine}
                  />
                ))}
              </Picker>
            )}
          </View>

          {/* Özel Alerji İsmi */}
          {selectedAllergy === 'Diğer' && (
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Özel Alerji İsmi</ThemedText>
              <TextInput
                style={styles.input}
                value={customAllergy}
                onChangeText={setCustomAllergy}
                placeholder="Alerji ismini girin"
                placeholderTextColor="#999"
              />
            </View>
          )}

          {/* Keşfedilme Tarihi Seçimi */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Keşfedilme Tarihi</ThemedText>
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
              placeholder="Alerji ile ilgili Belirtiler ekleyin"
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
          (isSaving || !selectedBabyId || !selectedAllergy || 
          (selectedAllergy === 'Diğer' && !customAllergy)) && styles.saveButtonDisabled
        ]}
        onPress={handleSave}
        disabled={isSaving || !selectedBabyId || !selectedAllergy || 
          (selectedAllergy === 'Diğer' && !customAllergy)}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <MaterialIcons name="check" size={24} color="#fff" />
            <ThemedText style={styles.saveButtonText}>Kaydet</ThemedText>
          </>
        )}
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
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pickerCancelButton: {
    color: Colors.light.tint,
    fontSize: 16,
  },
  picker: {
    height: 180,
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
  noDataText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  modalCancelButton: {
    fontSize: 17,
    color: '#666',
  },
  modalDoneButton: {
    fontSize: 17,
    color: Colors.light.tint,
    fontWeight: '600',
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemSelected: {
    backgroundColor: '#f8f8f8',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalItemTextSelected: {
    color: Colors.light.tint,
    fontWeight: '600',
  },
}); 