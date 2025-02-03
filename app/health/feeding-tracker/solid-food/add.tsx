import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { solidFoodApi } from '@/services/api/feeding/solid-food';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { useBabyContext } from '@/context/BabyContext';

const foodCategories = [
  { label: 'Meyve', value: 'fruit' },
  { label: 'Sebze', value: 'vegetable' },
  { label: 'Tahıl', value: 'grain' },
  { label: 'Protein', value: 'protein' },
  { label: 'Süt', value: 'milk' },
  { label: 'Yiyecek', value: 'food' },
  { label: 'İçecek', value: 'drink' },
  { label: 'Diğer', value: 'other' }
];

const SolidFoodAddScreen = () => {
  const { fetchBabies } = useBabyContext();
  const { babyId } = useLocalSearchParams<{ babyId: string }>();
  const [startTime, setStartTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [amount, setAmount] = useState('');
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<'fruit' | 'vegetable' | 'grain' | 'protein' | 'other'>('fruit');
  const [hasAllergy, setHasAllergy] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(foodCategories[0]);

  const handleSubmit = async () => {
    if (!amount || !foodName) {
      Alert.alert('Hata', 'Lütfen miktar ve yiyecek adını doldurunuz');
      return;
    }

    try {
      await solidFoodApi.createFeeding({
        babyId,
        startTime,
        amount: amount.toString(),
        foodType: {
          category,
          name: foodName
        },
        reaction: hasAllergy ? {
          hasAllergy,
          symptoms
        } : undefined,
        notes
      });
      
      await fetchBabies();
      router.back();
    } catch (error) {
      Alert.alert('Hata', 'Ek gıda kaydı eklenirken bir hata oluştu');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="restaurant" size={32} color="#FF69B4" />
          <ThemedText style={styles.headerText}>Yeni Ek Gıda Kaydı</ThemedText>
        </View>

        <View style={styles.formSection}>
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="schedule" size={24} color="#FF69B4" />
              <ThemedText style={styles.label}>Beslenme Zamanı</ThemedText>
            </View>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <ThemedText style={styles.dateText}>
                {format(startTime, 'dd MMMM yyyy HH:mm', { locale: tr })}
              </ThemedText>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={startTime}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setStartTime(selectedDate);
                  }
                }}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="category" size={24} color="#FF69B4" />
              <ThemedText style={styles.label}>Kategori</ThemedText>
            </View>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowCategoryPicker(true)}
            >
              <ThemedText style={styles.inputText}>
                {selectedCategory.label}
              </ThemedText>
            </TouchableOpacity>

            {Platform.OS === 'ios' && showCategoryPicker && (
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Picker
                    selectedValue={category}
                    onValueChange={(value) => {
                      setCategory(value);
                      const selected = foodCategories.find(cat => cat.value === value);
                      if (selected) setSelectedCategory(selected);
                    }}
                    style={styles.picker}
                  >
                    {foodCategories.map((cat) => (
                      <Picker.Item 
                        key={cat.value} 
                        label={cat.label} 
                        value={cat.value}
                      />
                    ))}
                  </Picker>
                  <TouchableOpacity 
                    style={styles.doneButton}
                    onPress={() => setShowCategoryPicker(false)}
                  >
                    <ThemedText style={styles.doneButtonText}>Tamam</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {Platform.OS === 'android' && showCategoryPicker && (
              <Picker
                selectedValue={category}
                onValueChange={(value) => {
                  setCategory(value);
                  const selected = foodCategories.find(cat => cat.value === value);
                  if (selected) setSelectedCategory(selected);
                  setShowCategoryPicker(false);
                }}
                mode="dropdown"
              >
                {foodCategories.map((cat) => (
                  <Picker.Item 
                    key={cat.value} 
                    label={cat.label} 
                    value={cat.value}
                  />
                ))}
              </Picker>
            )}
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="restaurant-menu" size={24} color="#FF69B4" />
              <ThemedText style={styles.label}>Yiyecek Adı</ThemedText>
            </View>
            <TextInput
              style={styles.input}
              value={foodName}
              onChangeText={setFoodName}
              placeholder="Örn: Elma püresi"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="straighten" size={24} color="#FF69B4" />
              <ThemedText style={styles.label}>Miktar</ThemedText>
            </View>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="Örn: 2 yemek kaşığı"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <TouchableOpacity 
              style={styles.allergyToggle}
              onPress={() => setHasAllergy(!hasAllergy)}
            >
              <MaterialIcons 
                name={hasAllergy ? "check-box" : "check-box-outline-blank"} 
                size={24} 
                color="#FF69B4" 
              />
              <ThemedText style={styles.allergyText}>Alerjik Reaksiyon Var</ThemedText>
            </TouchableOpacity>

            {hasAllergy && (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={symptoms}
                onChangeText={setSymptoms}
                placeholder="Belirtileri açıklayın..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="note" size={24} color="#FF69B4" />
              <ThemedText style={styles.label}>Notlar</ThemedText>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Eklemek istediğiniz notlar..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <MaterialIcons name="check" size={24} color="#FFF" />
          <ThemedText style={styles.saveButtonText}>Kaydet</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  formSection: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    margin: 16,
    padding: 16,
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
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#FF69B4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  pickerContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    overflow: 'hidden',
    marginTop: 5,
  },
  picker: {
    width: '100%',
    backgroundColor: '#F8F9FA',
  },
  pickerIOS: {
    height: 200,
  },
  pickerAndroidItem: {
    fontSize: 16,
    color: '#333',
    height: 50,
  },
  pickerIOSItem: {
    fontSize: 18,
    color: '#333',
  },
  allergyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  allergyText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 16,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  doneButton: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FF69B4',
    borderRadius: 8,
    marginTop: 8,
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SolidFoodAddScreen;