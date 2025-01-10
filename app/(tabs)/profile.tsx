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

type User = AuthUser & {
  avatar?: string;
};

export default function ProfileScreen() {
  const { user: authUser, signOut, isAuthenticated } = useAuth();


  const user = authUser as User;
  console.log(user)
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  const handleSignOut = async () => {
    await signOut();
    // router.push('/auth/login')
  };

  if (!isAuthenticated || !user) {
    // router.push('/auth/login')
    return null;
  }

  const MenuItem = ({ icon, title, onPress, color = tintColor, danger = false }: MenuItemProps) => (
    <Pressable 
      style={[styles.menuItem, danger && styles.dangerItem]} 
      onPress={onPress}
    >
      <MaterialIcons name={icon} size={24} color={danger ? Colors.danger : color} />
      <ThemedText style={[styles.menuText, danger && styles.dangerText]}>{title}</ThemedText>
    </Pressable>
  );

  const MenuContainer = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.menuContainer}>
      {children}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profil Başlığı */}
        <View style={styles.header}>
          <Pressable style={styles.avatarContainer}>
            {user?.avatar ? (
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
          <ThemedText style={styles.name}>{user?.name}</ThemedText>
          <ThemedText style={styles.email}>{user?.email}</ThemedText>
        </View>

        <MenuContainer>
          <MenuItem 
            icon="person" 
            title="Kişisel Bilgilerim"
            onPress={() => {router.push('/profile/user-info'); }} 
          />
          <MenuItem 
            icon="lock" 
            title="Şifre Değiştir"
            onPress={() => { router.push('/profile/change-password'); }} 
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

          <View style={[styles.divider, styles.thickDivider]} />

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
        </MenuContainer>
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
  menuContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
  },
  divider: {
    width: '100%',
    padding: 0,
    margin: 0,
    height: 9,
    backgroundColor: '#F5F5F5',
  },
  thickDivider: {
    opacity: 1,
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
