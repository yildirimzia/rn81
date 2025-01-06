import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { authApi } from '@/services/api/auth'; // API çağrıları için import
import { useRouter } from 'expo-router';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        try {
            const response = await authApi.requestPasswordReset({ email });

            if (response.success) {
                Alert.alert('Başarılı', response.data?.message);
                router.back()
            } else {
                Alert.alert('Hata', response.error?.message || 'Bir hata oluştu');
            }
        } catch (error) {
            Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

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
                    <TouchableOpacity 
                        style={styles.resetButton} 
                        onPress={handleResetPassword}
                    >
                        <ThemedText style={styles.buttonText}>Şifreyi Sıfırla</ThemedText>
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
}); 