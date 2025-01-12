import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Alert, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { authApi } from '@/services/api/auth';
import { useAuth } from '@/context/AuthContext';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { email } = params;
  const { signIn } = useAuth();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(params.remainingTime ? parseInt(params.remainingTime as string) : 120);
  const [canResend, setCanResend] = useState(false);
  const [activationToken, setActivationToken] = useState(params.activationToken as string);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (params.message) {
      if (params.remainingTime) {
        setError(params.message as string);
      } else {
        setSuccess(params.message as string);
      }
    }
  }, [params.message]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerification = async () => {
    if (!code) {
      setError('Lütfen aktivasyon kodunu giriniz');
      return;
    }

    try {
      setLoading(true);
      const response = await authApi.verifyEmail({
        activationToken: activationToken as string,
        code
      });

      if (response?.data?.success) {
        await signIn({
          user: response.data.user!,
          accessToken: response.data.accessToken!
        });
        
        router.replace("/(tabs)");
      } else {
        setError(response?.data?.message || 'Doğrulama başarısız');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      Alert.alert(
        'Hata',
        error.response?.data?.message || 'Doğrulama başarısız'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setCode('');
      
      const userGender = params.gender || 'not_specified';
      
      const response = await authApi.register({ 
        name: params.name as string,
        email: email as string,
        password: params.password as string,
        gender: userGender as 'male' | 'female' | 'not_specified'
      });

      if (response?.data) {
        if (response.data.activationToken) {
          setActivationToken(response.data.activationToken);
        }

        if (response.data.remainingTime) {
          setTimer(response.data.remainingTime);
          setCanResend(false);
          setError(`Yeni kod göndermek için ${formatTime(response.data.remainingTime)} bekleyiniz`);
        } else {
          setTimer(120);
          setCanResend(false);
          setSuccess('Yeni aktivasyon kodu gönderildi');
        }
      } else {
        throw new Error('Sunucu yanıtı geçersiz');
      }
    } catch (error: any) {
      console.error('Resend error:', error);
      setError(error.response?.data?.message || 'Kod gönderme işlemi başarısız');
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

          <View style={styles.timerContainer}>
            <View style={styles.timerCircle}>
              <View style={[
                styles.timerProgress,
                { 
                  borderColor: '#4285F4',
                  borderWidth: 3,
                  opacity: timer / 120,
                }
              ]} />
              <View style={styles.timerContent}>
                <ThemedText style={styles.timerText}>
                  {formatTime(timer)}
                </ThemedText>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.verifyButton, loading && styles.disabledButton]} 
            onPress={handleVerification}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? 'Doğrulanıyor...' : 'Doğrula'}
            </ThemedText>
          </TouchableOpacity>

          {success ? (
            <ThemedText style={styles.successText}>
              {success}
            </ThemedText>
          ) : null}

          {error ? (
            <ThemedText style={styles.errorText}>
              {error}
            </ThemedText>
          ) : null}


          {canResend && (
            <TouchableOpacity 
              style={[styles.resendButton]} 
              onPress={handleResendCode}
              disabled={loading || !canResend}
            >
              <ThemedText style={styles.resendButtonText}>
                Tekrar Gönder
              </ThemedText>
            </TouchableOpacity>
          )}
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
  codeInputContainer: {
    alignItems: 'center',
    gap: 24,
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
    marginTop: 32,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  timerProgress: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 32,
    borderColor: '#4285F4',
  },
  timerContent: {
    backgroundColor: 'white',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4285F4',
  },
  resendButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4285F4',
    marginTop: 8,
  },
  resendButtonText: {
    color: '#4285F4',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  successText: {
    color: '#34C759',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 16,
  },
}); 