import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import { authApi } from '@/services/api/auth'; // API çağrıları için import
import { useRouter } from 'expo-router';
import ResetPasswordForm from './resetPasswordForm';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [token, setToken] = useState<string | null>(null); // Token'ı saklamak için state
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    

    const handleResetPassword = async () => {

        if(!email) {
            setError('E-posta adresinizi giriniz');
            setSuccess(null);

            return;
        }

        setLoading(true);
        try {
            const response = await authApi.requestPasswordReset({ email });

            if (response.data?.success) {
                setSuccess(response.data?.message);
                // Token'ı URL'den al
                setError(null);

                const urlParams = new URLSearchParams(window.location.search);
                const tokenFromUrl = urlParams.get('token');
                setToken(tokenFromUrl); // Token'ı state'e kaydet
                
            } else {
                setError(response.data?.message || 'Bir hata oluştu');
                setSuccess(null);
            }
        } catch (error) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    // Eğer token varsa, ResetPasswordForm'u göster
    if (token) {
        return <ResetPasswordForm token={token} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.content}>
                <ThemedText style={styles.title}>Şifrenizi Sıfırlayın</ThemedText>
                <ThemedText style={styles.subtitle}>Şifrenizi sıfırlamak için lütfen e-posta adresinizi girin.</ThemedText>
                <View style={styles.form}>
                    <TextInput 
                        value={email}
                        onChangeText={setEmail}
                        placeholder="E-posta"
                        style={styles.input}
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        returnKeyType="done"
                    />

                    {error && <ThemedText style={styles.error}>{error}</ThemedText>}
                    {success && <ThemedText style={styles.success}>{success}</ThemedText>}
                    <TouchableOpacity 
                        style={[styles.resetButton, loading && styles.disabledButton]} 
                        onPress={handleResetPassword}
                        disabled={loading}
                    >
                        <ThemedText style={styles.buttonText}>
                            {loading ? 'Gönderiliyor...' : 'Şifreyi Sıfırla'}
                        </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
                        <ThemedText style={styles.cancelText}>Vazgeç</ThemedText>
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
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 20,
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
    resetButton: {
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
    cancelButton: {
        marginTop: 12,
        alignItems: 'center',
    },
    cancelText: {
        color: '#4285F4',
        fontSize: 14,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: '#A0A0A0',
        opacity: 0.7,
    },
    success: {
        color: 'green',
        textAlign: 'center',
        marginTop: 10,
    },
});