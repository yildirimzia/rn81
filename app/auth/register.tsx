import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

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
          <TextInput 
            placeholder="Ad Soyad"
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TextInput 
            placeholder="E-posta"
            style={styles.input}
            placeholderTextColor="#999"
            keyboardType="email-address"
          />
          <TextInput 
            placeholder="Şifre"
            style={styles.input}
            secureTextEntry
            placeholderTextColor="#999"
          />
          <TextInput 
            placeholder="Şifre Tekrar"
            style={styles.input}
            secureTextEntry
            placeholderTextColor="#999"
          />

          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={() => signIn()}
          >
            <ThemedText style={styles.buttonText}>
              Kayıt Ol
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <ThemedText>Zaten hesabınız var mı? </ThemedText>
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText style={styles.link}>Giriş Yap</ThemedText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Image 
            source={require('@/assets/images/google-icon.png')} 
            style={styles.googleIcon} 
          />
          <ThemedText>Google ile devam et</ThemedText>
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
}); 