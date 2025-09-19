import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { authApi } from '@/services/api/auth';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
  });

  const handleSubmit = async () => {
    if (!formData.oldPassword.trim()) {
      setError('Mevcut şifre alanı boş bırakılamaz');
      return;
    }

    if (!formData.newPassword.trim()) {
      setError('Yeni şifre alanı boş bırakılamaz');
      return;
    }

    if (!formData.newPasswordConfirm.trim()) {
      setError('Yeni şifre tekrar alanı boş bırakılamaz');
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError('Yeni şifreniz eski şifrenizle aynı olamaz');
      return;
    }

    if (formData.newPassword !== formData.newPasswordConfirm) {
      setError('Yeni şifreler birbiriyle eşleşmiyor');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Yeni şifre en az 8 karakter olmalıdır');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await authApi.updateUserPassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      if (response.data?.success) {
        Alert.alert('Başarılı', 'Şifreniz başarıyla güncellendi', [
          { text: 'Tamam', onPress: () => router.back() }
        ]);
      } else {
        setError(response.data?.message || 'Şifre güncellenirken bir hata oluştu');
      }
    } catch (error: any) {
      setError('Bir bağlantı hatası oluştu');
    } finally {
      setLoading(false);
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
            {/* Old Password Input */}
            <View style={styles.inputSection}>
              <ThemedText style={styles.label}>Mevcut Şifre *</ThemedText>
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  value={formData.oldPassword}
                  onChangeText={(text) => {
                    setFormData({...formData, oldPassword: text});
                    setError('');
                  }}
                  placeholder="Mevcut şifrenizi girin"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showOldPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowOldPassword(!showOldPassword)}
                >
                  <MaterialIcons 
                    name={showOldPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password Input */}
            <View style={styles.inputSection}>
              <ThemedText style={styles.label}>Yeni Şifre *</ThemedText>
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  value={formData.newPassword}
                  onChangeText={(text) => {
                    setFormData({...formData, newPassword: text});
                    setError('');
                  }}
                  placeholder="Yeni şifrenizi girin"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <MaterialIcons 
                    name={showNewPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputSection}>
              <ThemedText style={styles.label}>Yeni Şifre Tekrar *</ThemedText>
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  value={formData.newPasswordConfirm}
                  onChangeText={(text) => {
                    setFormData({...formData, newPasswordConfirm: text});
                    setError('');
                  }}
                  placeholder="Yeni şifrenizi tekrar girin"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <MaterialIcons 
                    name={showConfirmPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            ) : null}
          </ScrollView>

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.disabledButton]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <ThemedText style={styles.buttonText}>Şifre Güncelle</ThemedText>
              )}
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
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
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
  disabledButton: {
    opacity: 0.7,
  },
}); 