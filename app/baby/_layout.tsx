import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function BabyLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="gender-select" 
        options={{
          title: 'Bebek Ekle',
          presentation: 'modal',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen 
        name="female/add" 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="male/add" 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="detail/[id]" 
        options={{
          title: 'Bebek',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          )
        }}
      />
    </Stack>
  );
} 