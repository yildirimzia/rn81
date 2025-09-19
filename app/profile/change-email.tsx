import React, { useRef, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { authApi } from '@/services/api/auth';
import { useAuth } from '@/context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

const ActivationCodeInput = ({ value, onChangeText }: { value: string; onChangeText: (text: string) => void }) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const codeLength = 4;

  const handleChange = (text: string, index: number) => {
    const newCode = value.split('');
    newCode[index] = text;
    onChangeText(newCode.join(''));

    if (text && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.codeContainer}>
      {[...Array(codeLength)].map((_, index) => (
        <TextInput
          key={index}
          ref={ref => inputRefs.current[index] = ref}
          style={styles.codeInput}
          value={value[index] || ''}
          onChangeText={text => handleChange(text.slice(-1), index)}
          onKeyPress={e => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

export default function ChangeEmailScreen() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showActivationCode, setShowActivationCode] = useState(false);
  const [formData, setFormData] = useState({
    newEmail: '',
    confirmEmail: '',
    password: '',
    activationCode: ''
  });

  const handleSubmit = async () => {
    // Validations
    if (!formData.newEmail.trim()) {
      setError('Yeni e-posta alanı boş bırakılamaz');
      return;
    }

    if (!formData.confirmEmail.trim()) {
      setError('E-posta tekrar alanı boş bırakılamaz');
      return;
    }

    if (!formData.password.trim()) {
      setError('Şifre alanı boş bırakılamaz');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedNewEmail = formData.newEmail.trim();
    const trimmedConfirmEmail = formData.confirmEmail.trim();

    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır');
      return;
    }

    if (!emailRegex.test(trimmedNewEmail)) {
      setError('Geçerli bir e-posta adresi giriniz');
      return;
    }

    if (trimmedNewEmail !== trimmedConfirmEmail) {
      setError('E-posta adresleri eşleşmiyor');
      return;
    }

    if (trimmedNewEmail === user?.email) {
      setError('Yeni e-posta adresi mevcut e-posta adresinizle aynı olamaz');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await authApi.requestEmailChange({
        newEmail: trimmedNewEmail,
        password: formData.password
      });

      if (response?.data?.success) {
        setShowActivationCode(true);
      } else {
        setError(response?.error?.message || 'E-posta değişikliği başlatılırken bir hata oluştu');
      }
    } catch (error: any) {
      setError('Bir bağlantı hatası oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.activationCode || formData.activationCode.length !== 4) {
      setError('Lütfen geçerli bir aktivasyon kodu giriniz');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await authApi.verifyEmailChange(
        formData.newEmail,
        formData.activationCode
      );

      if (response.data?.success) {
        updateUser({ email: formData.newEmail });
        Alert.alert('Başarılı', 'E-posta adresiniz başarıyla güncellendi', [
          { text: 'Tamam', onPress: () => router.back() }
        ]);
      } else {
        setError(response.data?.message || 'Aktivasyon kodu doğrulanamadı');
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
            {!showActivationCode ? (
              <>
                {/* Current Email Input */}
                <View style={styles.inputSection}>
                  <ThemedText style={styles.label}>Kayıtlı E-posta Adresiniz</ThemedText>
                  <View style={[styles.inputContainer, styles.disabledContainer]}>
                    <MaterialIcons name="email" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput 
                      style={[styles.input, styles.disabledInput]}
                      value={user?.email}
                      editable={false}
                      placeholder="Mevcut e-posta"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                {/* New Email Input */}
                <View style={styles.inputSection}>
                  <ThemedText style={styles.label}>Yeni E-posta *</ThemedText>
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="email" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input}
                      value={formData.newEmail}
                      onChangeText={(text) => {
                        setFormData({...formData, newEmail: text.toLowerCase()});
                        setError('');
                      }}
                      placeholder="Yeni e-posta adresinizi girin"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                    />
                  </View>
                </View>

                {/* Confirm Email Input */}
                <View style={styles.inputSection}>
                  <ThemedText style={styles.label}>Yeni E-posta Tekrar *</ThemedText>
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="email" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input}
                      value={formData.confirmEmail}
                      onChangeText={(text) => {
                        setFormData({...formData, confirmEmail: text.toLowerCase()});
                        setError('');
                      }}
                      placeholder="Yeni e-posta adresinizi tekrar girin"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputSection}>
                  <ThemedText style={styles.label}>Şifre *</ThemedText>
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input}
                      value={formData.password}
                      onChangeText={(text) => {
                        setFormData({...formData, password: text});
                        setError('');
                      }}
                      placeholder="Şifrenizi girin"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity 
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <MaterialIcons 
                        name={showPassword ? "visibility" : "visibility-off"} 
                        size={20} 
                        color="#9CA3AF" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.activationSection}>
                <View style={styles.activationIconContainer}>
                  <MaterialIcons name="mail-outline" size={64} color="#5B8DEF" />
                </View>
                <ThemedText style={styles.activationTitle}>Aktivasyon Kodu</ThemedText>
                <ThemedText style={styles.activationDescription}>
                  {formData.newEmail} adresine gönderilen 4 haneli aktivasyon kodunu girin
                </ThemedText>
                
                <ActivationCodeInput
                  value={formData.activationCode}
                  onChangeText={(text) => {
                    setFormData({...formData, activationCode: text});
                    setError('');
                  }}
                />
              </View>
            )}

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
              onPress={showActivationCode ? handleVerifyCode : handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <ThemedText style={styles.buttonText}>
                  {showActivationCode ? 'Kodu Doğrula' : 'E-posta Güncelle'}
                </ThemedText>
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
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  activationSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  activationIconContainer: {
    marginBottom: 16,
  },
  activationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  activationDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  codeInput: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: '#F9FAFB',
    color: '#374151',
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
