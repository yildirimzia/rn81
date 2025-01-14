import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Alert, Text, ScrollView } from 'react-native';
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
  const [gender, setGender] = useState<'male' | 'female' | 'not_specified'>('not_specified');
  const [isAgreementAccepted, setIsAgreementAccepted] = useState(false);
  
  // Hata state'leri
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [showAgreementError, setShowAgreementError] = useState(false);

  const handleRegister = async () => {
    // Hata state'lerini temizle
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');

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

    if (!isAgreementAccepted) {
      setShowAgreementError(true);
      return;
    }
    setShowAgreementError(false);

    if (hasError) return;

    try {
      setLoading(true);
      const response = await authApi.register({ 
        name, 
        email: email.trim().toLowerCase(),
        password,
        gender: gender
      });

      if (response?.data?.success) {
        router.push({
          pathname: "/auth/verify-email",
          params: { 
            activationToken: response?.data?.activationToken,
            email,
            password,
            name,
            message: response.data.message,
            gender: gender.toString()
          }
        });
      } else {
        // Eğer aktif kod varsa doğrudan doğrulama sayfasına yönlendir
        if (response?.data?.activationToken) {
          router.push({
            pathname: '/auth/verify-email',
            params: {
              email,
              activationToken: response?.data?.activationToken,
              password,
              name,
              message: response?.data?.message,
              remainingTime: response?.data?.remainingTime?.toString(),
              gender: (response?.data?.gender || gender).toString()
            }
          });
        } else {
          setEmailError(response?.data?.message || 'Kayıt işlemi başarısız');
        }
      }
    } catch (error: any) {
      setGeneralError('Bir bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.push('/auth/login')}
        >
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
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

            <View style={styles.genderContainer}>
              <View style={styles.genderRowContainer}>
                <TouchableOpacity 
                  style={styles.genderOption}
                  onPress={() => setGender('female')}
                >
                  <Ionicons 
                    name={gender === 'female' ? 'radio-button-on' : 'radio-button-off'} 
                    size={24} 
                    color={gender === 'female' ? '#007AFF' : '#666'} 
                  />
                  <Text style={styles.genderText}>Kadın</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.genderOption}
                  onPress={() => setGender('male')}
                >
                  <Ionicons 
                    name={gender === 'male' ? 'radio-button-on' : 'radio-button-off'} 
                    size={24} 
                    color={gender === 'male' ? '#007AFF' : '#666'} 
                  />
                  <Text style={styles.genderText}>Erkek</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.genderOption}
                  onPress={() => setGender('not_specified')}
                >
                  <Ionicons 
                    name={gender === 'not_specified' ? 'radio-button-on' : 'radio-button-off'} 
                    size={24} 
                    color={gender === 'not_specified' ? '#007AFF' : '#666'} 
                  />
                  <Text style={styles.genderText}>Belirtmek istemiyorum</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.kvkkContainer}>
              <Ionicons name="information-circle-outline" size={20} color="#666" />
              <Text style={styles.kvkkText}>
                Kişisel verilerinizin işlenmesi hakkında detaylı bilgiye{' '}
                <Text 
                  style={styles.kvkkLink}
                  onPress={() => {
                    router.push('/legal/kvkk');
                  }}
                >
                  Web Sitesi Müşteri Aydınlatma Metni
                </Text>
                'nden ulaşabilirsiniz.
              </Text>
            </View>

            <View style={styles.agreementContainer}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => {
                  setIsAgreementAccepted(!isAgreementAccepted);
                  setShowAgreementError(false);
                }}
              >
                <Ionicons 
                  name={isAgreementAccepted ? "checkbox" : "square-outline"} 
                  size={20} 
                  color={isAgreementAccepted ? "#4285F4" : "#666"}
                />
              </TouchableOpacity>
              <Text style={styles.agreementText}>
                Web sitesi{' '}
                <Text 
                  style={styles.agreementLink} 
                  onPress={() => router.push('/legal/agreement')}
                >
                  üyelik sözleşmesini
                </Text>
                {' '}okudum, onaylıyorum.
              </Text>
            </View>
            {showAgreementError && <Text style={styles.errorText}>Lütfen üyelik sözleşmesini onaylayın</Text>}
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
            <TouchableOpacity onPress={() => {
              router.push('/auth/login');
            }}>
              <ThemedText style={styles.link}>Giriş Yap</ThemedText>
            </TouchableOpacity>
          </View>

          {generalError ? (
            <ThemedText style={styles.errorText}>{generalError}</ThemedText>
          ) : null}
        </ScrollView>
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
    gap: 11,
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
  label: {
    fontSize: 16,
    color: '#333',
  },
  kvkkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginVertical: 8,
    gap: 8,
  },
  kvkkText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  kvkkLink: {
    color: '#4285F4',
    textDecorationLine: 'underline',
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 8,
  },
  checkbox: {
    padding: 2,
  },
  agreementText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
  },
  agreementLink: {
    color: '#4285F4',
    textDecorationLine: 'underline',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
}); 