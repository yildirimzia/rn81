import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: {
            backgroundColor: 'white'
          }
        }}
      >
        <Stack.Screen 
          name="login" 
          options={{
            animation: 'none',
            header: () => null,
          }}
        />
        <Stack.Screen 
          name="register" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            header: () => null,
          }}
        />
        <Stack.Screen
          name="verify-email"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            header: () => null,
          }}
        />
        <Stack.Screen
          name="resetPassword"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            header: () => null,
          }}
        />
      </Stack>
    </View>
  );
} 