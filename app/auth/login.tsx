import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Image, Alert, Platform, ActivityIndicator, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/services/api/auth';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from '@expo/vector-icons/AntDesign';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isAuthenticated, successMessage, setSuccessMessage } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef<TextInput>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, setSuccessMessage]);

  useEffect(() => {
    if (response?.type === 'success') {
      
      const accessToken = response.params.access_token;
      if (accessToken) {
        handleGoogleLogin(accessToken);
      } else {
        setError('Google girişi başarısız oldu: Token alınamadı');
      }
    } else if (response?.type === 'error') {
      setError('Google girişi başarısız oldu: ' + response.error?.message);
    }
  }, [response]);

  const handleLogin = async () => {
    setEmailError(null);
    setPasswordError(null);
    setError(null);
    setIsLoading(true);
    if (!email) {
      setEmailError('E-posta alanı boş bırakılamaz');
    }
    if (!password) {
      setPasswordError('Şifre alanı boş bırakılamaz');
    }
    if (!email || !password) {
      return;
    }

    try {
      const response = await authApi.login({ email, password });

      if (!response.data?.success) {
        setError(response.error?.message || 'Giriş yapılamadı');
        return;
      }

      signIn({
        user: response.data.user,
        accessToken: response.data.accessToken,
      });

    } catch (error) {
      setError('Sunucu bağlantısında hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (accessToken: string) => {
    try {
      
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user info: ' + userInfoResponse.statusText);
      }
      
      const userData = await userInfoResponse.json();

      const platform = Platform.select({
        ios: 'ios',
        android: 'android',
        default: 'web'
      }) as 'web' | 'android' | 'ios';

      const response = await authApi.googleLogin({
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        platform
      });

      if (response.data?.success) {
        signIn({
          user: response.data.user,
          accessToken: response.data.accessToken,
        });
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setError('Google ile giriş yapılırken bir hata oluştu: ' + (error as Error).message);
    }
  };
  

  return (
    <LinearGradient 
      colors={['#E8EFFF', '#F0F4FF', '#FFFFFF']} 
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo ve başlık bölümü */}
          <View style={styles.logoSection}>
            {/* Bebek logosu */}
            <View style={styles.logoContainer}>
              <MaterialIcons name="child-care" size={60} color="#5B8DEF" />
            </View>
            
            <ThemedText style={styles.appTitle}></ThemedText>
            <ThemedText style={styles.appSubtitle}>Bebeğinizin güvenli yuvası</ThemedText>
          </View>

          {/* Form bölümü */}
          <View style={styles.formSection}>
            {/* E-posta input */}
            <View style={styles.inputContainer}>
              <TextInput 
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError(null);
                }}
                placeholder="E-posta"
                style={[styles.input, emailError && styles.inputError]}
                placeholderTextColor="#B8B8B8"
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
            </View>
            {emailError && <ThemedText style={styles.error}>{emailError}</ThemedText>}
            
            {/* Şifre input */}
            <View style={styles.inputContainer}>
              <TextInput 
                ref={passwordInputRef}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError(null);
                }}
                placeholder="Parola"
                style={[styles.input, passwordError && styles.inputError]}
                secureTextEntry={!showPassword}
                placeholderTextColor="#B8B8B8"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
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
            {passwordError && <ThemedText style={styles.error}>{passwordError}</ThemedText>}

            {error && (
              <ThemedText style={styles.error}>{error}</ThemedText>
            )}

            {successMessage && (
              <ThemedText style={styles.successMessage}>{successMessage}</ThemedText>
            )}
            
            {/* Şifremi unuttum */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Link href="/auth/resetPassword">
                <ThemedText style={styles.forgotText}>Şifreni mi unuttun?</ThemedText>
              </Link>
            </TouchableOpacity>
          </View>

          {/* Giriş butonu */}
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Giriş Yap</ThemedText>
            )}
          </TouchableOpacity>

          {/* Veya divider */}
          <View style={styles.divider}>
            <ThemedText style={styles.dividerText}>veya</ThemedText>
          </View>

          {/* Google ile giriş butonu */}
          <TouchableOpacity 
            style={styles.googleButton}
            onPress={() => promptAsync()}
            disabled={!request || isLoading}
          >
            <AntDesign name="google" size={20} color="#DB4437" />
            <ThemedText style={styles.googleButtonText}>Google ile giriş yap</ThemedText>
          </TouchableOpacity>

          {/* Alt footer */}
          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>Hesabın yok mu? </ThemedText>
            <Link href="/auth/register">
              <ThemedText style={styles.link}>Kaydol</ThemedText>
            </Link>
          </View>

          {/* Privacy links */}
          <View style={styles.privacyLinks}>
            <Link href="/legal/agreement">
              <ThemedText style={styles.privacyText}>Gizlilik Politikası</ThemedText>
            </Link>
            <ThemedText style={styles.privacyDot}> • </ThemedText>
            <Link href="/legal/kvkk">
              <ThemedText style={styles.privacyText}>Kullanım Koşulları</ThemedText>
            </Link>
          </View>
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
  logoSection: {
    alignItems: 'center',
    marginBottom: 60,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  inputError: {
    borderColor: '#E53E3E',
    borderWidth: 2,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 18,
    padding: 4,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 8,
  },
  forgotText: {
    color: '#5B8DEF',
    fontSize: 16,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#5B8DEF',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#5B8DEF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerText: {
    color: '#A0AEC0',
    fontSize: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    color: '#718096',
    fontSize: 16,
  },
  link: {
    color: '#5B8DEF',
    fontSize: 16,
    fontWeight: '600',
  },
  privacyLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  privacyText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  privacyDot: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  error: {
    color: '#E53E3E',
    fontSize: 14,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 4,
  },
  successMessage: {
    color: '#38A169',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
    fontWeight: '500',
  },
}); 