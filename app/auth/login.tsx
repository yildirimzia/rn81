import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Image, Alert, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/services/api/auth';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isAuthenticated, successMessage, setSuccessMessage } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  console.log(successMessage, 'successMessage1111');


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
      console.log('Full Google response:', response);
      
      const accessToken = response.params.access_token;
      if (accessToken) {
        handleGoogleLogin(accessToken);
      } else {
        console.log('No access token found in:', response.params);
        setError('Google girişi başarısız oldu: Token alınamadı');
      }
    } else if (response?.type === 'error') {
      console.log('Google OAuth Error:', response.error);
      setError('Google girişi başarısız oldu: ' + response.error?.message);
    }
  }, [response]);

  const handleLogin = async () => {
    setEmailError(null);
    setPasswordError(null);
    setError(null);

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

      if (!response.data?.success || !response.success) {
        console.log('response.data?.message', response.data?.message);
        setError(response.data?.message || 'Giriş yapılamadı');
        return;
      }

      signIn({
        user: response.data.user,
        accessToken: response.data.accessToken,
      });

    } catch (error) {
      console.error('Login error:', error);
      setError('Bir hata oluştu');
    }
  };

  const handleGoogleLogin = async (accessToken: string) => {
    try {
      console.log('Fetching user info with token:', accessToken);
      
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user info: ' + userInfoResponse.statusText);
      }
      
      const userData = await userInfoResponse.json();
      console.log('Google user data:', userData);

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
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>        
        <ThemedText style={styles.logo}>LOGO</ThemedText>
        

        <View style={styles.form}>
          <TextInput 
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(null);
            }}
            placeholder="E-posta"
            style={[styles.input, emailError && styles.inputError]}
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            returnKeyType="next"
            enablesReturnKeyAutomatically
            onSubmitEditing={() => passwordInputRef.current?.focus()}
          />
          {emailError && <ThemedText style={styles.error}>{emailError}</ThemedText>}
          
          <TextInput 
            ref={passwordInputRef}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(null);
            }}
            placeholder="Şifre"
            style={[styles.input, passwordError && styles.inputError]}
            secureTextEntry
            placeholderTextColor="#999"
            returnKeyType="done"
            enablesReturnKeyAutomatically
            onSubmitEditing={handleLogin}
          />
          {passwordError && <ThemedText style={styles.error}>{passwordError}</ThemedText>}

          {error && (
            <ThemedText style={styles.error}>{error}</ThemedText>
          )}

          {successMessage && (
          <ThemedText style={styles.successMessage}>{successMessage}</ThemedText>
          )}
        
          <TouchableOpacity style={styles.forgotPassword}>
            <Link href="/auth/resetPassword">
              <ThemedText style={styles.forgotText}>Şifremi Unuttum</ThemedText>
            </Link>
          </TouchableOpacity>

        </View>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => {
            handleLogin();
          }}
          
        >
          <ThemedText style={styles.buttonText}>Giriş Yap</ThemedText>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <ThemedText style={styles.dividerText}>veya</ThemedText>
          <View style={styles.line} />
        </View>

        <TouchableOpacity 
          style={styles.googleButton}
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <Image 
            source={require('@/assets/images/google-icon.png')} 
            style={styles.googleIcon} 
          />
          <ThemedText>Google ile devam et</ThemedText>
        </TouchableOpacity>

        <View style={styles.footer}>
          <ThemedText>Hesabınız yok mu? </ThemedText>
          <Link href="/auth/register">
            <ThemedText style={styles.link}>Kayıt Ol</ThemedText>
          </Link>
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
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4285F4',
    textAlign: 'center',
    marginBottom: 48,
    paddingTop: 50,
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
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    color: '#4285F4',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  link: {
    color: '#4285F4',
    fontWeight: '600',
  },
  error: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: -10,
    marginLeft: 4,
  },
  successMessage: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
}); 