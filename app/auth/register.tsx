import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { authApi } from '@/services/api/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Hata state'leri
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleRegister = async () => {
    // Hata state'lerini temizle
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    if (!name.trim()) {
      setNameError('Ad Soyad alanı boş bırakılamaz');
      hasError = true;
    }

    if (!email) {
      setEmailError('E-posta alanı boş bırakılamaz');
      hasError = true;
    } else if (!email.includes('@')) {
      setEmailError('Geçerli bir e-posta adresi giriniz');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Şifre alanı boş bırakılamaz');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalıdır');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Şifre tekrar alanı boş bırakılamaz');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Şifreler eşleşmiyor');
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);
      const response = await authApi.register({ 
        name, 
        email: email.trim().toLowerCase(),
        password 
      });

      console.log('Register response:', response);

      if (response?.data?.success) {
        router.push({
          pathname: "/auth/verify-email" as const,
          params: { 
            activationToken: response.data.activationToken,
            email,
            password,
            name
          }
        });
      } else {
        // Başarısız response için email hatasını göster
        setEmailError(response?.data?.message || 'Kayıt işlemi başarısız');
      }
    } catch (error: any) {
      // Sadece network vb. hatalar için
      Alert.alert(
        'Hata',
        'Bir bağlantı hatası oluştu. Lütfen tekrar deneyin.'
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

        <ThemedText style={styles.title}>Hesap Oluştur</ThemedText>
        <ThemedText style={styles.subtitle}>
          Hemen ücretsiz hesabınızı oluşturun
        </ThemedText>

        <View style={styles.form}>
          <View>
            <TextInput 
              placeholder="Ad Soyad"
              style={[styles.input, nameError && styles.inputError]}
              placeholderTextColor="#999"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setNameError('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              textContentType="name"
              autoComplete="name"
            />
            {nameError ? <ThemedText style={styles.errorText}>{nameError}</ThemedText> : null}
          </View>

          <View>
            <TextInput 
              placeholder="E-posta"
              style={[styles.input, emailError && styles.inputError]}
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              textContentType="emailAddress"
              autoComplete="email"
            />
            {emailError ? <ThemedText style={styles.errorText}>{emailError}</ThemedText> : null}
          </View>

          <View>
            <TextInput 
              placeholder="Şifre"
              style={[styles.input, passwordError && styles.inputError]}
              secureTextEntry
              placeholderTextColor="#999"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
            />
            {passwordError ? <ThemedText style={styles.errorText}>{passwordError}</ThemedText> : null}
          </View>

          <View>
            <TextInput 
              placeholder="Şifre Tekrar"
              style={[styles.input, confirmPasswordError && styles.inputError]}
              secureTextEntry
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError('');
              }}
            />
            {confirmPasswordError ? <ThemedText style={styles.errorText}>{confirmPasswordError}</ThemedText> : null}
          </View>

          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.disabledButton]} 
            onPress={handleRegister}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <ThemedText>Zaten hesabınız var mı? </ThemedText>
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText style={styles.link}>Giriş Yap</ThemedText>
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
  },
  registerButton: {
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  link: {
    color: '#4285F4',
    fontWeight: '600',
  },
  googleButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  disabledButton: {
    opacity: 0.7
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  }
}); 