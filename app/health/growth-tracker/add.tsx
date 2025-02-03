import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { growthApi } from '@/services/api/growth';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useBabyContext } from '@/context/BabyContext';

const GrowthAddScreen = () => {
  const { fetchBabies, babies } = useBabyContext();
  const { babyId } = useLocalSearchParams<{ babyId: string }>();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [notes, setNotes] = useState('');

  const baby = babies.find(b => b.id === babyId);
  const cardColor = baby?.gender === 'female' ? '#FF69B4' : '#4A90E2';

  const handleSubmit = async () => {
    if (!weight || !height) {
      Alert.alert('Hata', 'Lütfen boy ve kilo değerlerini giriniz');
      return;
    }

    try {
      await growthApi.createRecord({
        babyId,
        date,
        weight: parseFloat(weight),
        height: parseFloat(height),
        notes
      });
      
      await fetchBabies();
      router.back();
    } catch (error) {
      Alert.alert('Hata', 'Büyüme kaydı eklenirken bir hata oluştu');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: cardColor }]}>
        <View style={styles.headerContent}>
          <MaterialIcons name="child-care" size={24} color="#FFF" />
          <View>
            <ThemedText style={styles.headerTitle}>{baby?.name}</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Boy & Kilo Kaydı</ThemedText>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formSection}>
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="event" size={24} color={cardColor} />
              <ThemedText style={styles.label}>Tarih</ThemedText>
            </View>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <ThemedText style={styles.dateText}>
                {format(date, 'dd MMMM yyyy', { locale: tr })}
              </ThemedText>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="fitness-center" size={24} color={cardColor} />
              <ThemedText style={styles.label}>Kilo (kg)</ThemedText>
            </View>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder="Örn: 8.5"
            />
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="straighten" size={24} color={cardColor} />
              <ThemedText style={styles.label}>Boy (cm)</ThemedText>
            </View>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              keyboardType="decimal-pad"
              placeholder="Örn: 75"
            />
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="note" size={24} color={cardColor} />
              <ThemedText style={styles.label}>Notlar</ThemedText>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              placeholder="Eklemek istediğiniz notlar..."
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.saveButton, { backgroundColor: cardColor }]} 
        onPress={handleSubmit}
      >
        <MaterialIcons name="save" size={24} color="#FFF" />
        <ThemedText style={styles.saveButtonText}>Kaydet</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    gap: 16,
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
    marginBottom: 16,
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

export default GrowthAddScreen; 