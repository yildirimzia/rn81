import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { authApi } from '@/services/api/auth'; // API çağrıları için import
import { useSearchParams } from 'expo-router/build/hooks';
import { useAuth } from '@/context/AuthContext';

interface ResetPasswordFormProps {
    token: string;
}

export default function ResetPasswordForm({ token: propToken }: ResetPasswordFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || propToken || ''; // Use prop token as fallback
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { setSuccessMessage } = useAuth();


    useEffect(() => {
        if (!token) {
            setError('Geçersiz bağlantı.');
        }
    }, [token]);

    const handleResetPassword = async () => {


        if (!newPassword || !confirmPassword) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Şifreler eşleşmiyor. Lütfen şifrelerinizi kontrol edin.');
            return;
        }

        try {
            const response = await authApi.resetPassword({ token, newPassword });

            if (response.success) {
                setSuccessMessage('Şifreniz başarıyla sıfırlandı');
                router.replace('/auth/login');
            } else {
                setError(response.error?.message || 'Şifre sıfırlama başarısız oldu');
            }
        } catch (error) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.content}>
                <ThemedText style={styles.title}>Şifrenizi Sıfırlayın</ThemedText>
                <View style={styles.form}>
                    <TextInput 
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Yeni Şifre"
                        style={styles.input}
                        secureTextEntry
                        placeholderTextColor="#999"
                    />
                    <TextInput 
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Şifreyi Doğrula"
                        style={styles.input}
                        secureTextEntry
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity 
                        style={styles.resetButton} 
                        onPress={handleResetPassword}
                    >
                        <ThemedText style={styles.buttonText}>Şifreyi Sıfırla</ThemedText>
                    </TouchableOpacity>
                    {error && <ThemedText style={styles.error}>{error}</ThemedText>}
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
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
});
