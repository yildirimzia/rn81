import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { supplementApi } from '@/services/api/feeding/supplement';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { TextInput } from 'react-native-gesture-handler';
import { useBabyContext } from '@/context/BabyContext';

const supplementCategories = [
  { id: 'vitamin', name: 'Vitamin' },
  { id: 'mineral', name: 'Mineral' },
  { id: 'probiotic', name: 'Probiyotik' },
  { id: 'other', name: 'Diğer' }
];

const SupplementAddScreen = () => {
  const { fetchBabies } = useBabyContext();
  const { babyId } = useLocalSearchParams<{ babyId: string }>();
  const [startTime, setStartTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [supplementName, setSupplementName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(supplementCategories[0].id);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (!supplementName || !amount) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurunuz');
      return;
    }

    try {
      await supplementApi.createFeeding({
        babyId,
        startTime,
        supplementType: {
          category: selectedCategory,
          name: supplementName
        },
        amount,
        notes
      });
      
      await fetchBabies();
      router.back();
    } catch (error) {
      Alert.alert('Hata', 'Takviye kaydı eklenirken bir hata oluştu');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="medical-services" size={32} color="#FF69B4" />
          <ThemedText style={styles.headerText}>Yeni Takviye Kaydı</ThemedText>
        </View>

        <View style={styles.formSection}>
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="schedule" size={24} color="#FF69B4" />
              <ThemedText style={styles.label}>Veriliş Zamanı</ThemedText>
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryContainer}>
                {supplementCategories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && styles.selectedCategory
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <ThemedText style={[
                      styles.categoryText,
                      selectedCategory === category.id && styles.selectedCategoryText
                    ]}>
                      {category.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="medical-services" size={24} color="#FF69B4" />
              <ThemedText style={styles.label}>Takviye Adı</ThemedText>
            </View>
            <TextInput
              style={styles.input}
              value={supplementName}
              onChangeText={setSupplementName}
              placeholder="Örn: D Vitamini"
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
              placeholder="Örn: 5 damla"
              placeholderTextColor="#999"
            />
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
              numberOfLines={3}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <MaterialIcons name="save" size={24} color="#FFF" />
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
  categoryContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  selectedCategory: {
    backgroundColor: '#FF69B4',
    borderColor: '#FF69B4',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#FFF',
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
});

export default SupplementAddScreen;
