import { StyleSheet, View, ScrollView, TouchableOpacity, Image, RefreshControl, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { router } from 'expo-router';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const { isAuthenticated, signOut, user } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  const onRefresh = async () => {
    setRefreshing(true);
    // Yenileme işlemleri burada yapılacak
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header Section */}
          <LinearGradient
            colors={[Colors[colorScheme ?? 'light'].tint, '#4A90E2']}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <ThemedText style={styles.welcomeText}>Bebeğinizi Ekleyin</ThemedText>
              <ThemedText style={styles.headerSubtitle}>Gelişim takibine hemen başlayın</ThemedText>
            </View>
          </LinearGradient>

          {/* Bebek Ekleme Seçenekleri */}
          <View style={styles.babyOptionsContainer}>
            <TouchableOpacity 
              style={styles.babyCard}
              onPress={() => router.push('/baby/female/add' as any)}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FFA07A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.babyCardGradient}
              >
                <Image 
                  source={require('@/assets/images/baby-girl.png')} 
                  style={styles.babyImage}
                />
                <View style={styles.cardOverlay}>
                  <View style={styles.cardContent}>
                    <View style={styles.titleContainer}>
                      <MaterialIcons name="favorite" size={24} color="#FFF" />
                      <ThemedText style={styles.babyCardTitle}>Kız Bebek</ThemedText>
                    </View>
                    <ThemedText style={styles.babyCardSubtitle}>
                      Bebeğinizin gelişim yolculuğunu takip edin
                    </ThemedText>
                    <View style={styles.addButton}>
                      <MaterialIcons name="add-circle" size={24} color="#FFF" />
                      <ThemedText style={styles.addButtonText}>Şimdi Ekle</ThemedText>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.babyCard}
              onPress={() => router.push('/baby/male/add' as any)}
            >
              <LinearGradient
                colors={['#4FACFE', '#00F2FE']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.babyCardGradient}
              >
                <Image 
                  source={require('@/assets/images/baby-boy.png')} 
                  style={styles.babyImage}
                />
                <View style={styles.cardOverlay}>
                  <View style={styles.cardContent}>
                    <View style={styles.titleContainer}>
                      <MaterialIcons name="favorite" size={24} color="#FFF" />
                      <ThemedText style={styles.babyCardTitle}>Erkek Bebek</ThemedText>
                    </View>
                    <ThemedText style={styles.babyCardSubtitle}>
                      Bebeğinizin gelişim yolculuğunu takip edin
                    </ThemedText>
                    <View style={styles.addButton}>
                      <MaterialIcons name="add-circle" size={24} color="#FFF" />
                      <ThemedText style={styles.addButtonText}>Şimdi Ekle</ThemedText>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View>

          <TouchableOpacity 
                style={styles.aiAssistantCard} 
                onPress={() => router.push('/health/ai-assistant')}
              >
                <LinearGradient
                  colors={['#7F00FF', '#E100FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.aiGradient}
                >
                  <View style={styles.aiContent}>
                    <View style={styles.aiIconContainer}>
                      <MaterialIcons name="psychology" size={32} color="#FFF" />
                    </View>
                    <View style={styles.aiTextContainer}>
                      <ThemedText style={styles.aiTitle}>AI Asistan</ThemedText>
                      <ThemedText style={styles.aiSubtitle}>
                        Bebeğiniz için akıllı öneriler ve yanıtlar
                      </ThemedText>
                    </View>
                    <View style={styles.aiBadge}>
                      <ThemedText style={styles.aiBadgeText}>Yeni</ThemedText>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
          </View>

          {/* Gelişim Takibi Bölümü */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Gelişim Takibi</ThemedText>
            </View>
            
            <View style={styles.developmentList}>
              <TouchableOpacity 
                style={styles.developmentItem} 
                onPress={() => router.push('/health/growth-tracker')}
              >
                <MaterialIcons name="straighten" size={24} color={Colors[colorScheme ?? 'light'].tint} />
                <View style={styles.developmentContent}>
                  <ThemedText style={styles.developmentTitle}>Boy & Kilo Takibi</ThemedText>
                  <ThemedText style={styles.developmentSubtitle}>Bebeğinizin büyüme grafiği</ThemedText>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.developmentItem}
                onPress={() => router.push('/health')}
              >
                <MaterialIcons name="event" size={24} color={Colors[colorScheme ?? 'light'].tint} />
                <View style={styles.developmentContent}>
                  <ThemedText style={styles.developmentTitle}>Sağlık Takibi</ThemedText>
                  <ThemedText style={styles.developmentSubtitle}>Bebeğinizin sağlık kayıtları</ThemedText>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.developmentItem}
                onPress={() => router.push('/health/development-guide')}
              >
                <MaterialIcons name="menu-book" size={24} color={Colors[colorScheme ?? 'light'].tint} />
                <View style={styles.developmentContent}>
                  <ThemedText style={styles.developmentTitle}>Gelişim Rehberi</ThemedText>
                  <ThemedText style={styles.developmentSubtitle}>Aylık gelişim bilgileri</ThemedText>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>

            </View>
          </View>

        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.tint,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#FFF',
    opacity: 0.9,
  },
  babyOptionsContainer: {
    padding: 20,
    gap: 20,
  },
  babyCard: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  babyCardGradient: {
    flex: 1,
  },
  babyImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.6,
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  cardContent: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  babyCardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  babyCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  developmentList: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  developmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  developmentContent: {
    flex: 1,
    marginLeft: 16,
  },
  developmentTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  developmentSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  aiAssistantCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#7F00FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  aiGradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  aiContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  aiSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  aiBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    marginLeft: 8,
  },
  aiBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
