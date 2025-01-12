import { StyleSheet, View, ScrollView, Pressable, Image, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { User as AuthUser } from '@/context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { authApi } from '@/services/api/auth';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

type MenuItemProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  onPress: () => void;
  color?: string;
  danger?: boolean;
};

type User = AuthUser & {
  avatar?: {
    url: string;
    public_id: string;
  };
};

export default function ProfileScreen() {
  const { user: authUser, signOut, isAuthenticated, updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const user = authUser as User;
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login')
  };

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Galeriye erişim izni gereklidir.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setIsUploading(true);
        try {
          const response = await authApi.updateUserAvatar({
            avatar: `data:image/jpeg;base64,${result.assets[0].base64}`
          });

          if (response?.data?.success) {
            updateUser(response.data.user);
            Alert.alert('Başarılı', 'Profil resmi güncellendi');
          }
        } catch (error: any) {
          Alert.alert('Hata', error.message || 'Resim yüklenirken bir hata oluştu');
        }
        setIsUploading(false);
      }
    } catch (error) {
      Alert.alert('Hata', 'Resim seçilirken bir hata oluştu');
      setIsUploading(false);
    }
  };

  if (!isAuthenticated || !user) {
    router.push('/auth/login')
    return null;
  }

  const MenuItem = ({ icon, title, onPress, color = tintColor, danger = false }: MenuItemProps) => (
    <Pressable 
      style={[styles.menuItem, danger && styles.dangerItem]} 
      onPress={onPress}
    >
      <View style={styles.menuIconContainer}>
        <MaterialIcons name={icon} size={22} color={danger ? Colors.danger : color} />
      </View>
      <ThemedText style={[styles.menuText, danger && styles.dangerText]}>{title}</ThemedText>
      <MaterialIcons name="chevron-right" size={24} color="#999" />
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[Colors[colorScheme ?? 'light'].tint, '#4A90E2']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Pressable 
              style={styles.avatarContainer}
              onPress={handleImagePick}
              disabled={isUploading}
            >
              {isUploading ? (
                <View style={styles.avatarPlaceholder}>
                  <ActivityIndicator size="large" color="#FFF" />
                </View>
              ) : user?.avatar?.url ? (
                <>
                  <Image source={{ uri: user.avatar.url }} style={styles.avatar} />
                  <View style={styles.editIconContainer}>
                    <MaterialIcons name="edit" size={16} color="#FFF" />
                  </View>
                </>
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <MaterialIcons name="camera-alt" size={30} color="#FFF" />
                </View>
              )}
            </Pressable>
            <ThemedText style={styles.name}>{user?.name}</ThemedText>
            <ThemedText style={styles.email}>{user?.email}</ThemedText>
          </View>
        </LinearGradient>

        <View style={styles.menuWrapper}>
          <View style={styles.menuContainer}>
            <MenuItem 
              icon="person" 
              title="Kişisel Bilgilerim"
              onPress={() => {router.push('/profile/user-info');}} 
            />
            <MenuItem 
              icon="lock" 
              title="Şifre Değiştir"
              onPress={() => {router.push('/profile/change-password');}} 
            />
            <MenuItem 
              icon="email" 
              title="E-posta Değiştir"
              onPress={() => {router.push('/profile/change-email');}} 
            />
            <MenuItem 
              icon="notifications" 
              title="Bildirim Ayarlarım"
              onPress={() => {}} 
            />
          </View>

          <View style={styles.menuContainer}>
            <MenuItem 
              icon="info" 
              title="Hakkımızda"
              onPress={() => router.push('/legal/agreement')} 
            />
            <MenuItem 
              icon="cancel" 
              title="Üyeliği İptal Et"
              onPress={() => {}} 
              danger
            />
            <MenuItem 
              icon="logout" 
              title="Çıkış Yap"
              onPress={handleSignOut}
              danger
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: Colors.light.tint,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFF',
  },
  email: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
  },
  menuWrapper: {
    padding: 16,
    gap: 16,
  },
  menuContainer: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  menuText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: Colors.danger,
  },
});
