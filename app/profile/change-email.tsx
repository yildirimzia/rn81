import React, { useRef, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
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
  const [success, setSuccess] = useState(false);
  const [showActivationCode, setShowActivationCode] = useState(false);
  const [formData, setFormData] = useState({
    newEmail: '',
    confirmEmail: '',
    password: '',
    activationCode: ''
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const trimmedNewEmail = formData.newEmail.trim();
      const trimmedConfirmEmail = formData.confirmEmail.trim();

      if (!trimmedNewEmail || !trimmedConfirmEmail || !formData.password) {
        setError('Lütfen tüm alanları doldurunuz');
        return;
      }

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
      setError('Beklenmeyen bir hata oluştu, lütfen tekrar deneyin');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData.activationCode || formData.activationCode.length !== 4) {
        setError('Lütfen geçerli bir aktivasyon kodu giriniz');
        return;
      }

      const response = await authApi.verifyEmailChange(
        formData.newEmail,
        formData.activationCode
      );

      console.log(response, 'responseemaill');

      if (response.data?.success) {
        setSuccess(true);
        setShowActivationCode(false);
        updateUser({ email: formData.newEmail });
          router.back();
      } else {
        setError(response.data?.message || 'Aktivasyon kodu doğrulanamadı');
      }
    } catch (error: any) {
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
            {!showActivationCode ? (
              <>
                <ThemedText style={styles.label}>Kayıtlı E-posta Adresiniz</ThemedText>
                <TextInput 
                  style={[styles.input, { backgroundColor: '#f5f5f5' }]}
                  value={user?.email}
                  editable={false}
                  placeholder="Mevcut e-posta"
                  placeholderTextColor="#999"
                />

                <View style={styles.infoContainer}>
                  <MaterialIcons name="info-outline" size={20} color="#666" />
                  <ThemedText style={styles.infoText}>
                    Değişikliği yapıp kaydet dediğinizde, tarafınıza bir onay e-postası gönderilecektir. 
                    E-postadaki aktivasyon kodunu girerek e-posta adresinizi değiştirebilirsiniz.
                  </ThemedText>
                </View>

                <ThemedText style={styles.label}>Yeni e-posta*</ThemedText>
                <TextInput 
                  style={styles.input}
                  value={formData.newEmail}
                  onChangeText={(text) => setFormData({...formData, newEmail: text.toLowerCase()})}
                  placeholder="Yeni e-posta adresinizi girin"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                />

                <ThemedText style={styles.label}>Yeni e-posta tekrar*</ThemedText>
                <TextInput 
                  style={styles.input}
                  value={formData.confirmEmail}
                  onChangeText={(text) => setFormData({...formData, confirmEmail: text.toLowerCase()})}
                  placeholder="Yeni e-posta adresinizi tekrar girin"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                />

                <ThemedText style={styles.label}>Şifre*</ThemedText>
                <TextInput 
                  style={styles.input}
                  value={formData.password}
                  onChangeText={(text) => setFormData({...formData, password: text})}
                  placeholder="Şifrenizi girin"
                  placeholderTextColor="#999"
                  secureTextEntry
                />
              </>
            ) : (
              <View style={styles.activationContainer}>
                <MaterialIcons name="mail-outline" size={50} color={Colors.light.tint} />
                <ThemedText style={styles.activationTitle}>Aktivasyon Kodu</ThemedText>
                <ThemedText style={styles.activationDescription}>
                  {formData.newEmail} adresine gönderilen 4 haneli aktivasyon kodunu girin
                </ThemedText>
                
                <ActivationCodeInput
                  value={formData.activationCode}
                  onChangeText={(text) => setFormData({...formData, activationCode: text})}
                />
              </View>
            )}

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
            {success ? <ThemedText style={styles.successText}>E-posta başarıyla güncellendi</ThemedText> : null}
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabledButton]} 
          onPress={showActivationCode ? handleVerifyCode : handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText style={styles.buttonText}>
              {showActivationCode ? 'DOĞRULA' : 'KAYDET'}
            </ThemedText>
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
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    padding: 16,
    gap: 16,
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
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  activationContainer: {
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  activationTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
  },
  activationDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
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
  successText: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
});
