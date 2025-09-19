import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { authApi } from '@/services/api/auth';

export default function UserInfoScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    gender: user?.gender || 'not_specified',
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Hata', 'Ad alanı boş bırakılamaz');
      return;
    }

    try {
      const response = await authApi.updateUserInfo({
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
      });

      if (response.success) {
        updateUser({
          name: formData.name,
          gender: formData.gender,
        });
        Alert.alert('Başarılı', 'Bilgileriniz güncellendi', [
          { text: 'Tamam', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Hata', 'Bilgiler güncellenirken bir hata oluştu');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir bağlantı hatası oluştu');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Name Input */}
            <View style={styles.inputSection}>
              <ThemedText style={styles.label}>Ad*</ThemedText>
              <View style={styles.inputContainer}>
                <MaterialIcons name="person" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholder="Adınızı girin"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputSection}>
              <ThemedText style={styles.label}>E-posta*</ThemedText>
              <View style={[styles.inputContainer, styles.disabledContainer]}>
                <MaterialIcons name="email" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput 
                  style={[styles.input, styles.disabledInput]}
                  value={formData.email}
                  editable={false}
                  placeholder="E-posta adresinizi girin"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Gender Selection */}
            <View style={styles.genderSection}>
              <ThemedText style={styles.label}>Cinsiyet</ThemedText>
              
              <TouchableOpacity 
                style={[styles.genderCard, formData.gender === 'female' && styles.genderCardSelected]}
                onPress={() => setFormData({...formData, gender: 'female'})}
              >
                <View style={[styles.radioButton, formData.gender === 'female' && styles.radioButtonSelected]} />
                <ThemedText style={[styles.genderText, formData.gender === 'female' && styles.genderTextSelected]}>Kadın</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.genderCard, formData.gender === 'male' && styles.genderCardSelected]}
                onPress={() => setFormData({...formData, gender: 'male'})}
              >
                <View style={[styles.radioButton, formData.gender === 'male' && styles.radioButtonSelected]} />
                <ThemedText style={[styles.genderText, formData.gender === 'male' && styles.genderTextSelected]}>Erkek</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.genderCard, formData.gender === 'not_specified' && styles.genderCardSelected]}
                onPress={() => setFormData({...formData, gender: 'not_specified'})}
              >
                <View style={[styles.radioButton, formData.gender === 'not_specified' && styles.radioButtonSelected]} />
                <ThemedText style={[styles.genderText, formData.gender === 'not_specified' && styles.genderTextSelected]}>Belirtmek istemiyorum</ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
            >
              <ThemedText style={styles.buttonText}>Gönder</ThemedText>
            </TouchableOpacity>
          </View>
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
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledContainer: {
    backgroundColor: '#F9FAFB',
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
  disabledInput: {
    color: '#9CA3AF',
  },
  genderSection: {
    marginTop: 8,
  },
  genderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  genderCardSelected: {
    borderWidth: 2,
    borderColor: '#5B8DEF',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
    marginRight: 16,
  },
  radioButtonSelected: {
    borderColor: '#5B8DEF',
    backgroundColor: '#5B8DEF',
  },
  genderText: {
    fontSize: 16,
    color: '#374151',
  },
  genderTextSelected: {
    color: '#5B8DEF',
    fontWeight: '500',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F5F5F5',
  },
  submitButton: {
    backgroundColor: '#5B8DEF',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#5B8DEF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 