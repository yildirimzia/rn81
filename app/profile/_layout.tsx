import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#000',
        },
        presentation: 'modal',
        animation: 'slide_from_bottom',
        headerLeft: ({  }) => (
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ marginLeft: 10 }}
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen 
        name="user-info" 
        options={{
          headerTitle: 'Bilgilerim',
        }}
      />
      <Stack.Screen 
        name="change-password" 
        options={{
          headerTitle: 'Şifremi Değiştir',
        }}
      />
      <Stack.Screen
       name='change-email'
       options={{
        headerTitle: 'E-Posta Değiştir',
       }}
      />
      <Stack.Screen 
        name="babies" 
        options={{
          headerTitle: 'Bebeklerim',
        }}
      />
    </Stack>
  );
} 