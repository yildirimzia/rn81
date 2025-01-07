import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/services/api/auth';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {

    if (!email || !password) {
      setError('Lütfen e-posta adresinizi ve şifrenizi giriniz');
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
  

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>        
        <ThemedText style={styles.logo}>LOGO</ThemedText>
        
        <View style={styles.form}>
          <TextInput 
            value={email}
            onChangeText={setEmail}
            placeholder="E-posta"
            style={styles.input}
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            returnKeyType="next"
            enablesReturnKeyAutomatically
            onSubmitEditing={() => passwordInputRef.current?.focus()}
          />
          <TextInput 
            ref={passwordInputRef}
            value={password}
            onChangeText={setPassword}
            placeholder="Şifre"
            style={styles.input}
            secureTextEntry
            placeholderTextColor="#999"
            returnKeyType="done"
            enablesReturnKeyAutomatically
            onSubmitEditing={handleLogin}
          />

          {error && (
            <ThemedText style={styles.error}>{error}</ThemedText>
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

        <TouchableOpacity style={styles.googleButton}>
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
    color: 'red',
    textAlign: 'left',
    marginBottom: 16,
  },
}); 