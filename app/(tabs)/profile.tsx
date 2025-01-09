import { StyleSheet, View, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { User as AuthUser } from '@/context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

type MenuItemProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  onPress: () => void;
  color?: string;
  danger?: boolean;
};

type MenuSectionProps = {
  title: string;
  children: React.ReactNode;
};

type User = AuthUser & {
  avatar?: string;
};

export default function ProfileScreen() {
  const { user: authUser, signOut, isAuthenticated } = useAuth();
  const user = authUser as User;
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  if (!isAuthenticated || !user) {
    router.replace('/auth/login');
    return null;
  }

  const MenuItem = ({ icon, title, onPress, color = tintColor, danger = false }: MenuItemProps) => (
    <Pressable 
      style={[styles.menuItem, danger && styles.dangerItem]} 
      onPress={onPress}
    >
      <MaterialIcons name={icon} size={24} color={danger ? Colors.danger : color} />
      <ThemedText style={[styles.menuText, danger && styles.dangerText]}>{title}</ThemedText>
      <MaterialIcons name="chevron-right" size={20} color={danger ? Colors.danger : Colors[colorScheme ?? 'light'].text} />
    </Pressable>
  );

  const MenuSection = ({ title, children }: MenuSectionProps) => (
    <View style={styles.menuSection}>
      <ThemedText style={styles.menuSectionTitle}>{title}</ThemedText>
      <View style={styles.menuSectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profil Başlığı */}
        <View style={styles.header}>
          <Pressable style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons 
                  name="camera-alt" 
                  size={30} 
                  color={Colors[colorScheme ?? 'light'].tint} 
                />
              </View>
            )}
          </Pressable>
          <ThemedText style={styles.name}>{user.name}</ThemedText>
          <ThemedText style={styles.email}>{user.email}</ThemedText>
        </View>

        {/* Kişisel Ayarlar */}
        <MenuSection title="Kişisel Ayarlar">
          <MenuItem 
            icon="person" 
            title="Kişisel Bilgilerim"
            onPress={() => {}} 
          />
          <MenuItem 
            icon="lock" 
            title="Şifre Değiştir"
            onPress={() => {}} 
          />
          <MenuItem 
            icon="email" 
            title="E-posta Değiştir"
            onPress={() => {}} 
          />
          <MenuItem 
            icon="notifications" 
            title="Bildirim Ayarlarım"
            onPress={() => {}} 
          />
        </MenuSection>

        {/* Genel Ayarlar */}
        <MenuSection title="Genel Ayarlar">
          <MenuItem 
            icon="info" 
            title="Hakkımızda"
            onPress={() => router.push('/legal/agreement')} 
          />
          <MenuItem 
            icon="cancel" 
            title="Üyeliği İptal Et"
            onPress={() => {}} 
          />
          <MenuItem 
            icon="logout" 
            title="Çıkış Yap"
            onPress={handleSignOut}
          />
        </MenuSection>
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
  header: {
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  menuSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  menuSectionContent: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
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
