import { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Alert, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import { authApi } from '@/services/api/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
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
    <LinearGradient 
      colors={['#E8EFFF', '#F0F4FF', '#FFFFFF']} 
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => router.back()}
          >
            <MaterialIcons name="close" size={24} color="#2D3748" />
          </TouchableOpacity>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Logo ve başlık bölümü */}
            <View style={styles.logoSection}>
              {/* <View style={styles.logoContainer}>
                <MaterialIcons name="child-care" size={60} color="#5B8DEF" />
              </View> */}
              <ThemedText style={styles.appSubtitle}>Hemen ücretsiz hesabınızı oluşturun</ThemedText>
            </View>

            {/* Form bölümü */}
            <View style={styles.formSection}>
              {/* Ad Soyad input */}
              <View style={styles.inputContainer}>
                <TextInput 
                  placeholder="Ad Soyad"
                  style={[styles.input, nameError && styles.inputError]}
                  placeholderTextColor="#B8B8B8"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setNameError('');
                  }}
                  autoCapitalize="words"
                  autoCorrect={false}
                  spellCheck={false}
                  textContentType="name"
                  autoComplete="name"
                  returnKeyType="next"
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                />
              </View>
              {nameError ? <ThemedText style={styles.error}>{nameError}</ThemedText> : null}

              {/* E-posta input */}
              <View style={styles.inputContainer}>
                <TextInput 
                  ref={emailInputRef}
                  placeholder="E-posta"
                  style={[styles.input, emailError && styles.inputError]}
                  placeholderTextColor="#B8B8B8"
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
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                />
              </View>
              {emailError ? <ThemedText style={styles.error}>{emailError}</ThemedText> : null}

              {/* Şifre input */}
              <View style={styles.inputContainer}>
                <TextInput 
                  ref={passwordInputRef}
                  placeholder="Şifre"
                  style={[styles.input, passwordError && styles.inputError]}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#B8B8B8"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError('');
                  }}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons 
                    name={showPassword ? "visibility" : "visibility-off"} 
                    size={24} 
                    color="#B8B8B8" 
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <ThemedText style={styles.error}>{passwordError}</ThemedText> : null}

              {/* Şifre Tekrar input */}
              <View style={styles.inputContainer}>
                <TextInput 
                  ref={confirmPasswordInputRef}
                  placeholder="Şifre Tekrar"
                  style={[styles.input, confirmPasswordError && styles.inputError]}
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#B8B8B8"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setConfirmPasswordError('');
                  }}
                  returnKeyType="done"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <MaterialIcons 
                    name={showConfirmPassword ? "visibility" : "visibility-off"} 
                    size={24} 
                    color="#B8B8B8" 
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? <ThemedText style={styles.error}>{confirmPasswordError}</ThemedText> : null}

              {/* Cinsiyet seçimi */}
              <View style={styles.genderContainer}>
                <ThemedText style={styles.genderLabel}>Cinsiyet</ThemedText>
                <View style={styles.genderRowContainer}>
                  <TouchableOpacity 
                    style={styles.genderOption}
                    onPress={() => setGender('male')}
                  >
                    <View style={[styles.radioButton, gender === 'male' && styles.radioButtonSelected]} />
                    <Text style={styles.genderText}>Erkek</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.genderOption}
                    onPress={() => setGender('female')}
                  >
                    <View style={[styles.radioButton, gender === 'female' && styles.radioButtonSelected]} />
                    <Text style={styles.genderText}>Kadın</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.genderOption}
                    onPress={() => setGender('not_specified')}
                  >
                    <View style={[styles.radioButton, gender === 'not_specified' && styles.radioButtonSelected]} />
                    <Text style={styles.genderText}>Belirtmek istemiyorum</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* KVKK Bilgilendirme */}
              <View style={styles.kvkkContainer}>
                <MaterialIcons name="info-outline" size={20} color="#5B8DEF" />
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

              {/* Sözleşme onayı */}
              <View style={styles.agreementContainer}>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => {
                    setIsAgreementAccepted(!isAgreementAccepted);
                    setShowAgreementError(false);
                  }}
                >
                  <MaterialIcons 
                    name={isAgreementAccepted ? "check-box" : "check-box-outline-blank"} 
                    size={20} 
                    color={isAgreementAccepted ? "#5B8DEF" : "#B8B8B8"}
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
              {showAgreementError && <Text style={styles.error}>Lütfen üyelik sözleşmesini onaylayın</Text>}
            </View>

            {/* Kayıt butonu */}
            <TouchableOpacity 
              style={[styles.registerButton, loading && styles.disabledButton]} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Kayıt Ol</ThemedText>
              )}
            </TouchableOpacity>

            {/* Alt footer */}
            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>Zaten hesabınız var mı? </ThemedText>
              <TouchableOpacity onPress={() => {
                router.back()
              }}>
                <ThemedText style={styles.link}>Giriş Yap</ThemedText>
              </TouchableOpacity>
            </View>

            {generalError ? (
              <ThemedText style={styles.error}>{generalError}</ThemedText>
            ) : null}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginTop: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(91, 141, 239, 0.15)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 32,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    fontSize: 16,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  inputError: {
    borderColor: '#E53E3E',
    backgroundColor: 'rgba(254, 243, 243, 0.9)',
  },
  eyeButton: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  error: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  genderContainer: {
    marginBottom: 20,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  genderRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 24,
    marginTop: 8,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: '#5B8DEF',
    backgroundColor: '#5B8DEF',
    position: 'relative',
  },
  genderText: {
    fontSize: 14,
    color: '#374151',
  },
  kvkkContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(91, 141, 239, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(91, 141, 239, 0.2)',
  },
  kvkkText: {
    flex: 1,
    fontSize: 12,
    color: '#4A5568',
    lineHeight: 18,
    marginLeft: 8,
  },
  kvkkLink: {
    color: '#5B8DEF',
    fontWeight: '600',
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    
  },
  checkbox: {
    padding: 2,
  },
  agreementText: {
    flex: 1,
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 18,
    marginLeft: 8,
  },
  agreementLink: {
    color: '#5B8DEF',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#5B8DEF',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 24,
    marginBottom: 20,
    shadowColor: '#5B8DEF',
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
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#718096',
  },
  link: {
    fontSize: 14,
    color: '#5B8DEF',
    fontWeight: '600',
  },
}); 