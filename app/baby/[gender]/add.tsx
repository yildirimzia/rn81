import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator, Image, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
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
    gender: gender === 'female' ? 'female' : 'male',
    snacks: []
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
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#374151" />
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
              <ActivityIndicator size="small" color={gender === 'female' ? '#F472B6' : '#6366F1'} />
            ) : (
              <ThemedText style={[styles.saveButtonText, { color: gender === 'female' ? '#F472B6' : '#6366F1' }]}>Kaydet</ThemedText>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Photo Section */}
          <View style={styles.photoSection}>
            <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.babyPhoto} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <MaterialIcons 
                    name="photo-camera" 
                    size={40} 
                    color="#6B7280" 
                  />
                </View>
              )}
            </TouchableOpacity>
            <ThemedText style={[styles.photoLabel, { color: gender === 'female' ? '#F472B6' : '#60A5FA' }]}>
              {image ? 'Fotoğrafı değiştir' : 'Fotoğraf ekle'}
            </ThemedText>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Baby Name */}
            <View style={styles.inputSection}>
              <ThemedText style={styles.label}>Bebeğin Adı</ThemedText>
              <View style={styles.inputContainer}>
                <MaterialIcons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={babyInfo.name}
                  onChangeText={(text) => {
                    setBabyInfo(prev => ({ ...prev, name: text }));
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Bebeğin Adı"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.name && (
                <ThemedText style={styles.errorText}>{errors.name}</ThemedText>
              )}
            </View>

            {/* Birth Date */}
            <View style={styles.inputSection}>
              <ThemedText style={styles.label}>Doğum Tarihi</ThemedText>
              <TouchableOpacity 
                style={styles.dateInputContainer}
                onPress={() => setShowDatePicker(true)}
              >
                <ThemedText style={styles.dateText}>
                  {(babyInfo.birthDate as Date).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric'
                  }).replace(/\./g, '/')}
                </ThemedText>
                <View style={styles.dateIcons}>
                  <MaterialIcons name="event" size={20} color="#6B7280" style={styles.dateIcon} />
                  <MaterialIcons name="date-range" size={20} color="#6B7280" />
                </View>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={babyInfo.birthDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setBabyInfo(prev => ({ ...prev, birthDate: selectedDate }));
                    }
                  }}
                />
              )}
            </View>

            {/* Weight and Height */}
            <View style={styles.measurementsRow}>
              <View style={[styles.inputSection, { flex: 1 }]}>
                <ThemedText style={styles.label}>Doğum Kilosu</ThemedText>
                <View style={styles.measurementContainer}>
                  <TextInput
                    style={styles.measurementInput}
                    value={babyInfo.weight === 0 ? '' : babyInfo.weight.toString()}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setBabyInfo(prev => ({ 
                        ...prev, 
                        weight: Number(numericValue) || 0 
                      }));
                      if (errors.weight) setErrors(prev => ({ ...prev, weight: undefined }));
                    }}
                    placeholder="3200"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                  <ThemedText style={styles.unitText}>gram</ThemedText>
                </View>
                {errors.weight && (
                  <ThemedText style={styles.errorText}>{errors.weight}</ThemedText>
                )}
              </View>

              <View style={[styles.inputSection, { flex: 1 }]}>
                <ThemedText style={styles.label}>Doğum Boyu</ThemedText>
                <View style={styles.measurementContainer}>
                  <TextInput
                    style={styles.measurementInput}
                    value={babyInfo.height === 0 ? '' : babyInfo.height.toString()}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setBabyInfo(prev => ({ 
                        ...prev, 
                        height: Number(numericValue) || 0 
                      }));
                      if (errors.height) setErrors(prev => ({ ...prev, height: undefined }));
                    }}
                    placeholder="50"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                  <ThemedText style={styles.unitText}>cm</ThemedText>
                </View>
                {errors.height && (
                  <ThemedText style={styles.errorText}>{errors.height}</ThemedText>
                )}
              </View>
            </View>

            {/* General Error */}
            {errors.general && (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{errors.general}</ThemedText>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity 
            style={[
              styles.saveBottomButton, 
              { 
                backgroundColor: gender === 'female' ? '#F472B6' : '#6366F1',
                shadowColor: gender === 'female' ? '#F472B6' : '#6366F1',
              },
              loading && styles.disabledButton
            ]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons name="check" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <ThemedText style={styles.saveBottomButtonText}>Kaydet</ThemedText>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  babyPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    paddingVertical: 0,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  dateIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateIcon: {
    marginRight: 4,
  },
  measurementsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  measurementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  measurementInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    paddingVertical: 0,
    textAlign: 'center',
  },
  unitText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F5F5F5',
  },
  saveBottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveBottomButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 