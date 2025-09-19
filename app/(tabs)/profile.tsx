import { StyleSheet, View, ScrollView, Pressable, Image, Alert, ActivityIndicator, Dimensions, TouchableOpacity, Share } from 'react-native';
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
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as StoreReview from 'expo-store-review';

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

  if (!isAuthenticated || !user) {
    useEffect(() => {
      router.push('/auth/login');
    }, []);
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    useEffect(() => {
      router.push('/auth/login');
    }, []);
  };

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Galeriye erişim izni gereklidir.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images" as ImagePicker.MediaType,
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

  const MenuItem = ({ icon, title, onPress, color = '#374151', danger = false }: MenuItemProps) => (
    <Pressable 
      style={[styles.menuItem, danger && styles.dangerItem]} 
      onPress={onPress}
    >
      <ThemedText style={[styles.menuText, danger && styles.dangerText]}>{title}</ThemedText>
      <MaterialIcons name="chevron-right" size={20} color={danger ? '#EF4444' : '#9CA3AF'} />
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={['#B8B5FF', '#E8EFFF', '#FFFFFF']}
        style={styles.gradientBackground}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header with avatar */}
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
                  <View style={styles.avatarWrapper}>
                    <Image source={{ uri: user.avatar.url }} style={styles.avatar} />
                  </View>
                  <View style={styles.cameraIconContainer}>
                    <MaterialIcons name="camera-alt" size={20} color="#FFF" />
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.avatarWrapper}>
                    <View style={styles.avatarPlaceholder}>
                      <MaterialIcons name="person" size={60} color="#D1D5DB" />
                    </View>
                  </View>
                  <View style={styles.cameraIconContainer}>
                    <MaterialIcons name="camera-alt" size={20} color="#FFF" />
                  </View>
                </>
              )}
            </Pressable>
            <ThemedText style={styles.name}>{user?.name}</ThemedText>
            <ThemedText style={styles.email}>{user?.email}</ThemedText>
          </View>

          {/* Main menu section */}
          <View style={styles.menuSection}>
            <MenuItem 
              icon="person" 
              title="Kişisel Bilgiler"
              onPress={() => {router.push('/profile/user-info');}} 
            />
            <MenuItem 
              icon="child-care" 
              title="Bebeklerim"
              onPress={() => router.push('/profile/babies' as any)} 
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
              title="Bildirim Ayarları"
              onPress={() => {}} 
            />
          </View>

          {/* Rating section */}
          <View style={styles.ratingSection}>
            <ThemedText style={styles.ratingTitle}>Uygulamayı Sevdiniz mi?</ThemedText>
            <ThemedText style={styles.ratingSubtitle}>
              Bize destek olmak için puan verin veya arkadaşlarınızla paylaşın!
            </ThemedText>
            <View style={styles.ratingButtons}>
              <TouchableOpacity 
                style={styles.ratingButton}
                onPress={async () => {
                  if (await StoreReview.hasAction()) {
                    await StoreReview.requestReview();
                  }
                }}
              >
                <MaterialIcons name="star" size={20} color="#5B8DEF" />
                <ThemedText style={styles.ratingButtonText}>Puan Ver</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={() => {
                  Share.share({
                    message: 'Bu uygulamayı çok beğendim, siz de denemelisiniz!',
                    url: 'https://your-app-store-link.com',
                    title: 'Harika bir uygulama!'
                  });
                }}
              >
                <MaterialIcons name="share" size={20} color="#5B8DEF" />
                <ThemedText style={styles.shareButtonText}>Paylaş</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom menu section */}
          <View style={styles.menuSection}>
            <MenuItem 
              icon="info" 
              title="Hakkımızda"
              onPress={() => router.push('/legal/agreement')} 
            />
          </View>

          <View style={styles.menuSection}>
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
        </ScrollView>
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 32,
  },
  avatarContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  avatarPlaceholder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#5B8DEF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1F2937',
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  dangerItem: {
  },
  dangerText: {
    color: '#EF4444',
  },
  ratingSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5EDFF',
  },
  ratingButtonText: {
    fontSize: 14,
    color: '#5B8DEF',
    fontWeight: '600',
    marginLeft: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5EDFF',
  },
  shareButtonText: {
    fontSize: 14,
    color: '#5B8DEF',
    fontWeight: '600',
    marginLeft: 8,
  },
});
