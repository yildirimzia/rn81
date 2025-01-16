import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator, Image, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { babyApi } from '@/services/api/baby';
import { IBabyData } from '@/services/api/baby';

export default function AddBabyScreen() {
  const router = useRouter();
  const { gender } = useLocalSearchParams<{ gender: string }>();
  
  const [babyInfo, setBabyInfo] = useState<Omit<IBabyData, 'birthDate' | 'id'> & { birthDate: Date }>({
    name: '',
    birthDate: new Date(),
    weight: 0,
    height: 0,
    gender: gender === 'female' ? 'female' : 'male'
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    weight?: string;
    height?: string;
    general?: string;
  }>({});

  const handleSave = async () => {
    try {
      setLoading(true);
      setErrors({});  // Hataları temizle

      // Form validasyonu
      const newErrors: any = {};

      if (!babyInfo.name.trim()) {
        newErrors.name = 'Lütfen bebeğin adını girin';
      }

      if (!babyInfo.weight) {
        newErrors.weight = 'Lütfen doğum kilosunu girin';
      }

      if (!babyInfo.height) {
        newErrors.height = 'Lütfen doğum boyunu girin';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const data = {
        ...babyInfo,
        weight: Number(babyInfo.weight),
        height: Number(babyInfo.height)
      };

      if (image) {
        data.photo = { url: image };
      }

      const response = await babyApi.createBaby(data);
      
      if (!response.success) {
        if (response.error?.message.includes('giriş')) {
          router.replace('/auth/login' as any);
          return;
        }
        setErrors({ general: response.error?.message || 'Bir hata oluştu' });
        return;
      }

      router.back();
      
    } catch (error: any) {
      setErrors({ general: error.message || 'Bir hata oluştu' });
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'İzin Gerekli',
        'Galeriye erişim izni gerekiyor',
        [{ text: 'Tamam' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      setBabyInfo(prev => ({ 
        ...prev, 
        photo: { url: imageUri }
      }));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>
            {gender === 'female' ? 'Kız Bebek Ekle' : 'Erkek Bebek Ekle'}
          </ThemedText>
          <TouchableOpacity 
            onPress={handleSave} 
            style={styles.saveButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.light.tint} />
            ) : (
              <ThemedText style={styles.saveButtonText}>Kaydet</ThemedText>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.babyPhoto} />
              ) : (
                <View style={[
                  styles.babyIcon,
                  { backgroundColor: gender === 'female' ? 'rgba(255, 182, 193, 0.1)' : 'rgba(135, 206, 235, 0.1)' }
                ]}>
                  <MaterialIcons 
                    name="add-a-photo" 
                    size={48} 
                    color={gender === 'female' ? '#FF69B4' : '#4A90E2'} 
                  />
                </View>
              )}
              <ThemedText style={styles.photoHint}>
                {image ? 'Fotoğrafı değiştir' : 'Fotoğraf ekle'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <MaterialIcons name="person" size={20} color="#666" />
                <ThemedText style={styles.label}>Bebeğin Adı</ThemedText>
              </View>
              <TextInput
                style={styles.input}
                value={babyInfo.name}
                onChangeText={(text) => setBabyInfo(prev => ({ ...prev, name: text }))}
                placeholder="Bebeğinizin adını girin"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <MaterialIcons name="cake" size={20} color="#666" />
                <ThemedText style={styles.label}>Doğum Tarihi</ThemedText>
              </View>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <ThemedText style={styles.dateText}>
                  {(babyInfo.birthDate as Date).toLocaleDateString('tr-TR')}
                </ThemedText>
                <MaterialIcons name="calendar-today" size={20} color="#666" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={babyInfo.birthDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setBabyInfo(prev => ({ ...prev, birthDate: selectedDate }));
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.measurementsContainer}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <View style={styles.labelContainer}>
                  <MaterialIcons name="fitness-center" size={20} color="#666" />
                  <ThemedText style={styles.label}>Doğum Kilosu</ThemedText>
                </View>
                <TextInput
                  style={styles.input}
                  value={babyInfo.weight === 0 ? '' : babyInfo.weight.toString()}
                  onChangeText={(text) => setBabyInfo(prev => ({ 
                    ...prev, 
                    weight: Number(text) || 0 
                  }))}
                  placeholder="örn: 3250"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
                <ThemedText style={styles.unit}>gram</ThemedText>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <View style={styles.labelContainer}>
                  <MaterialIcons name="straighten" size={20} color="#666" />
                  <ThemedText style={styles.label}>Doğum Boyu</ThemedText>
                </View>
                <TextInput
                  style={styles.input}
                  value={babyInfo.height === 0 ? '' : babyInfo.height.toString()}
                  onChangeText={(text) => setBabyInfo(prev => ({ 
                    ...prev, 
                    height: Number(text) || 0 
                  }))}
                  placeholder="örn: 50"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
                <ThemedText style={styles.unit}>cm</ThemedText>
              </View>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: Colors.light.tint,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  babyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
  },
  unit: {
    position: 'absolute',
    right: 12,
    top: 48,
    color: '#999',
    fontSize: 14,
  },
  formSection: {
    padding: 20,
    gap: 24,
  },
  inputGroup: {
    position: 'relative',
  },
  measurementsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  photoContainer: {
    alignItems: 'center',
  },
  babyPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  photoHint: {
    fontSize: 14,
    color: Colors.light.tint,
    marginTop: 8,
  },
}); 