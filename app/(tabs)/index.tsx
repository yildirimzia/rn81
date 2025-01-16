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

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);

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
            {/* Tekil Bebek Kartları */}
            <View style={styles.singleBabySection}>
              <View style={styles.babyCardsContainer}>
                <TouchableOpacity style={styles.babyCard}>
                  <View style={[styles.babyIconContainer, { backgroundColor: 'rgba(255, 182, 193, 0.1)' }]}>
                    <MaterialIcons name="child-care" size={40} color="#FF69B4" />
                  </View>
                  <ThemedText style={styles.babyCardTitle}>Kız Bebek</ThemedText>
                  <ThemedText style={styles.babyCardSubtitle}>Eklemek için dokunun</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.babyCard}>
                  <View style={[styles.babyIconContainer, { backgroundColor: 'rgba(135, 206, 235, 0.1)' }]}>
                    <MaterialIcons name="child-care" size={40} color="#4A90E2" />
                  </View>
                  <ThemedText style={styles.babyCardTitle}>Erkek Bebek</ThemedText>
                  <ThemedText style={styles.babyCardSubtitle}>Eklemek için dokunun</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* İkiz Bebek Kartı */}
            <View style={styles.twinBabySection}>
              <TouchableOpacity style={styles.twinBabyCard}>
                <View style={styles.twinIconsContainer}>
                  <View style={[styles.twinIconWrapper, { backgroundColor: 'rgba(255, 182, 193, 0.1)' }]}>
                    <MaterialIcons name="child-care" size={32} color="#FF69B4" />
                  </View>
                  <View style={[styles.twinIconWrapper, { backgroundColor: 'rgba(135, 206, 235, 0.1)' }]}>
                    <MaterialIcons name="child-care" size={32} color="#4A90E2" />
                  </View>
                </View>
                <ThemedText style={styles.twinCardTitle}>İkiz Bebek Ekle</ThemedText>
                <ThemedText style={styles.twinCardSubtitle}>İkiz bebeklerinizi birlikte takip edin</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Gelişim Takibi Bölümü */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Gelişim Takibi</ThemedText>
            </View>
            
            <View style={styles.developmentList}>
              <TouchableOpacity style={styles.developmentItem}>
                <MaterialIcons name="straighten" size={24} color={Colors[colorScheme ?? 'light'].tint} />
                <View style={styles.developmentContent}>
                  <ThemedText style={styles.developmentTitle}>Boy & Kilo Takibi</ThemedText>
                  <ThemedText style={styles.developmentSubtitle}>Bebeğinizin büyüme grafiği</ThemedText>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.developmentItem}>
                <MaterialIcons name="event" size={24} color={Colors[colorScheme ?? 'light'].tint} />
                <View style={styles.developmentContent}>
                  <ThemedText style={styles.developmentTitle}>Aşı Takvimi</ThemedText>
                  <ThemedText style={styles.developmentSubtitle}>Aşı zamanlarını takip edin</ThemedText>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.developmentItem}>
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
    marginTop: 20,
    padding: 16,
    gap: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  singleBabySection: {
    gap: 8,
  },
  babyCardsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  twinBabySection: {
    gap: 8,
  },
  babyCard: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  babyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  babyCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  babyCardSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  twinBabyCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  twinIconsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  twinIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  twinCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  twinCardSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
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
});
