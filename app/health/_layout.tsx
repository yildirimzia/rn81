import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function HealthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          title: 'Sağlık',
          headerShadowVisible: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen 
        name="vaccine-tracker/index"
        options={{
          title: 'Aşı Takibi',
          headerShadowVisible: false,
          headerBackTitle: 'Sağlık',
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
        name="vaccine-tracker/add"
        options={{
          title: 'Aşı Ekle',
          headerShadowVisible: false,
          presentation: 'modal',
          headerBackTitle: 'Geri',
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
        name="allergy-tracker/index"
        options={{
          title: 'Alerji Takibi',
          headerShadowVisible: false,
          headerBackTitle: 'Sağlık',
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
        name="allergy-tracker/add"
        options={{
          title: 'Alerji Ekle',
          headerShadowVisible: false,
          presentation: 'modal',
          headerBackTitle: 'Geri',
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
        name="teeth-tracker/add"
        options={{
          title: 'Diş Ekle',
          headerShadowVisible: false,
          presentation: 'modal',
          headerBackTitle: 'Geri',
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
        name="teeth-tracker/index"
        options={{
          title: 'Diş Takibi',
          headerShadowVisible: false,
          presentation: 'modal',
          headerBackTitle: 'Geri',
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