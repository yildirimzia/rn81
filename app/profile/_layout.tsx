import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="user-info" options={{
             headerShown: true,
             headerTitle: 'Bilgilerim',
             headerTitleAlign: 'center',
             headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold',
              color: '#000',
             }
            }} />
        <Stack.Screen name="change-password" options={{
             headerShown: true,
             headerTitle: 'Şifremi Değiştir',
             headerTitleAlign: 'center',
             headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold',
              color: '#000',
             }
            }} />
      </Stack>
    </View>
    );
} 