import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { authApi } from '@/services/api/auth';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { activationToken, email } = params;

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    if (!code) {
      Alert.alert('Hata', 'Lütfen aktivasyon kodunu giriniz');
      return;
    }

    try {
      setLoading(true);
      const response = await authApi.verifyEmail({
        activationToken: activationToken as string,
        code
      });

      if (response?.data?.success) {
        Alert.alert(
          'Başarılı',
          'Hesabınız başarıyla aktifleştirildi',
          [
            {
              text: 'Tamam',
              onPress: () => router.push("/auth/login" as const)
            }
          ]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Hata',
        error.response?.data?.message || 'Doğrulama başarısız'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>

        <ThemedText style={styles.title}>E-posta Doğrulama</ThemedText>
        <ThemedText style={styles.subtitle}>
          {email} adresine gönderilen aktivasyon kodunu giriniz
        </ThemedText>

        <View style={styles.form}>
          <TextInput 
            placeholder="Aktivasyon Kodu"
            style={styles.input}
            placeholderTextColor="#999"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={4}
          />

          <TouchableOpacity 
            style={[styles.verifyButton, loading && styles.disabledButton]} 
            onPress={handleVerification}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? 'Doğrulanıyor...' : 'Doğrula'}
            </ThemedText>
          </TouchableOpacity>
        </View>
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
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginTop: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 8,
  },
  verifyButton: {
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7
  }
}); 