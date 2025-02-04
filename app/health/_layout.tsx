import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function HealthLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
        <Stack.Screen 
          name="feeding-tracker/index"
          options={{
            title: 'Beslenme Takibi',
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
          name="feeding-tracker/breast-milk/breast_milk"
          options={{
            title: 'Anne Sütü Takibi',
            headerShadowVisible: false,
            headerBackTitle: 'Kategoriler',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="feeding-tracker/breast-milk/breast_milk_add"
          options={{
            title: 'Yeni Emzirme Kaydı',
            headerShadowVisible: false,
            presentation: 'modal',
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => router.back()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />

        <Stack.Screen 
          name="feeding-tracker/breast-milk/stats"
          options={{
            title: 'Anne Sütü Takibi İstatistikleri',
            headerShadowVisible: false,
            headerBackTitle: 'Kategoriler',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />

        <Stack.Screen 
          name="feeding-tracker/formula/formula"
          options={{
            title: 'Mama Takibi',
            headerShadowVisible: false,
            headerBackTitle: 'Kategoriler',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="feeding-tracker/formula/add"
          options={{
            title: 'Mama Ekle',
            headerShadowVisible: false,
            presentation: 'modal',
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => router.back()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="feeding-tracker/formula/index"
          options={{
            title: 'Mama Takibi',
            headerShadowVisible: false,
            headerBackTitle: 'Kategoriler',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />


        <Stack.Screen 
          name="feeding-tracker/formula/stats"
          options={{
            title: 'Mama Takibi İstatistikleri',
            headerShadowVisible: false,
            headerBackTitle: 'Kategoriler',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
          <Stack.Screen 
          name="feeding-tracker/solid-food/add"
          options={{
            title: 'Ek Gıda Ekle',
            headerShadowVisible: false,
            presentation: 'modal',
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => router.back()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="feeding-tracker/solid-food/index"
          options={{
            title: 'Ek Gıda Takibi',
            headerShadowVisible: false,
            headerBackTitle: 'Kategoriler',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />


        <Stack.Screen 
          name="feeding-tracker/solid-food/stats"
          options={{
            title: 'Ek Gıda Takibi İstatistikleri',
            headerShadowVisible: false,
            headerBackTitle: 'Kategoriler',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="feeding-tracker/water/add"
          options={{
            title: 'Su Ekle',
            headerShadowVisible: false,
            presentation: 'modal',
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => router.back()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="feeding-tracker/water/index"
          options={{
            title: 'Su Takibi',
            headerShadowVisible: false,
            headerBackTitle: 'Kategoriler',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="feeding-tracker/water/stats"
          options={{
            title: 'Su Takibi İstatistikleri',
            headerShadowVisible: false,
            headerBackTitle: 'Kategoriler',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
               <Stack.Screen 
          name="feeding-tracker/supplement/add" 
          options={{
            title: 'Vitamin/Takviye Ekle',
            headerShadowVisible: false,
            presentation: 'modal',
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => router.back()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="feeding-tracker/supplement/index"
          options={{
            title: 'Vitamin/Takviye Takibi',
            headerShadowVisible: false,
            headerBackTitle: 'Kategoriler',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="feeding-tracker/supplement/stats"
          options={{
            title: 'Vitamin/Takviye İstatistikleri',
            headerShadowVisible: false,
            headerBackTitle: 'Kategoriler',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="feeding-tracker/snacks/add"
          options={{
            title: 'Atıştırmalık Ekle',
            headerShadowVisible: false,
            presentation: 'modal',
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => router.back()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="feeding-tracker/snacks/index"
          options={{
            title: 'Atıştırmalık Takibi',
            headerShadowVisible: false,
            headerBackTitle: 'Kategoriler',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="feeding-tracker/snacks/stats"
          options={{
            title: 'Atıştırmalık İstatistikleri',
            headerShadowVisible: false,
            headerBackTitle: 'Kategoriler',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="growth-tracker/add"
          options={{
            title: 'Boy/Kilo Kaydı Ekle',
            headerShadowVisible: false,
            presentation: 'modal',
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => router.back()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="growth-tracker/stats"
          options={{
            title: 'Büyüme İstatistikleri',
            headerShadowVisible: false,
            headerBackTitle: 'Geri',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="growth-tracker/index"
          options={{
            title: 'Gelişim Takibi',
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
          name="ai-assistant/index"
          options={{
            title: 'AI Asistan',
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
      </Stack>
    </GestureHandlerRootView>
  );
} 