import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { authApi } from '@/services/api/auth';

export default function ChangePasswordScreen() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData.oldPassword || !formData.newPassword || !formData.newPasswordConfirm) {
        setError('Lütfen eski ve yeni şifrenizi giriniz');
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

      const response = await authApi.updateUserPassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      if (response.data?.success) {
        setFormData({
          oldPassword: '',
          newPassword: '',
          newPasswordConfirm: ''
        });
        setSuccess(true);
      } else {
        setError(response.data?.message || 'Şifre güncellenirken bir hata oluştu');
      }
    } catch (error: any) {
      console.error('Password update error:', error);
      setError('Beklenmeyen bir hata oluştu, lütfen tekrar deneyin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
         <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Mevcut Şifre*</ThemedText>
              <TextInput 
                style={styles.input}
                value={formData.oldPassword}
                onChangeText={(text) => setFormData({...formData, oldPassword: text})}
                placeholder="Mevcut şifrenizi girin"
                placeholderTextColor="#999"
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Yeni Şifre*</ThemedText>
              <TextInput 
                style={styles.input}
                value={formData.newPassword}
                onChangeText={(text) => setFormData({...formData, newPassword: text})}
                placeholder="Yeni şifrenizi girin"
                placeholderTextColor="#999"
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Yeni Şifre Tekrar*</ThemedText>
              <TextInput 
                style={styles.input}
                value={formData.newPasswordConfirm}
                onChangeText={(text) => setFormData({...formData, newPasswordConfirm: text})}
                placeholder="Yeni şifrenizi tekrar girin"
                placeholderTextColor="#999"
                secureTextEntry
              />
            </View>

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
            {success ? <ThemedText style={styles.successText}>Şifre başarıyla güncellendi</ThemedText> : null}
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText style={styles.buttonText}>GÜNCELLE</ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
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
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    padding: 16,
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  genderContainer: {
    marginVertical: 10,
  },
  genderRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
    gap: 24,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginHorizontal: 2,
  },
  genderText: {
    fontSize: 13,
    color: '#333',
    flexShrink: 1,
  },
  submitButton: {
    backgroundColor: Colors.light.tint,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 8,
  },
}); 