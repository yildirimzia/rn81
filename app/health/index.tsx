import { StyleSheet, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function HealthScreen() {
  const categories = [
    {
      id: 'growth',
      title: 'Büyüme Takibi',
      subtitle: 'Boy ve kilo gelişimini izleyin',
      icon: 'straighten',
      route: '/health/growth-tracker',
      gradientColors: ['#6B73FF', '#8E5CFF'] as const,
      iconBackground: 'rgba(107, 115, 255, 0.15)'
    },
    {
      id: 'vaccines',
      title: 'Aşı Takibi',
      subtitle: 'Aşı takvimini takip edin',
      icon: 'vaccines',
      route: '/health/vaccine-tracker',
      gradientColors: ['#4facfe', '#00f2fe'] as const,
      iconBackground: 'rgba(79, 172, 254, 0.15)'
    },
    {
      id: 'feeding',
      title: 'Beslenme Takibi',
      subtitle: 'Beslenme alışkanlıklarını kaydedin',
      icon: 'restaurant',
      route: '/health/feeding-tracker',
      gradientColors: ['#fa709a', '#fee140'] as const,
      iconBackground: 'rgba(250, 112, 154, 0.15)'
    },
    {
      id: 'teeth',
      title: 'Diş Takibi',
      subtitle: 'Diş gelişimini takip edin',
      icon: 'face',
      route: '/health/teeth-tracker',
      gradientColors: ['#a8edea', '#fed6e3'] as const,
      iconBackground: 'rgba(168, 237, 234, 0.15)'
    },
    {
      id: 'allergies',
      title: 'Alerji Takibi',
      subtitle: 'Alerjileri ve reaksiyonları kaydedin',
      icon: 'healing',
      route: '/health/allergy-tracker',
      gradientColors: ['#ffecd2', '#fcb69f'] as const,
      iconBackground: 'rgba(255, 236, 210, 0.15)'
    },
    {
      id: 'ai-assistant',
      title: 'AI Sağlık Asistanı',
      subtitle: 'Akıllı sağlık önerileri alın',
      icon: 'psychology',
      route: '/health/ai-assistant',
      gradientColors: ['#6B73FF', '#8E5CFF'] as const,
      iconBackground: 'rgba(107, 115, 255, 0.15)',
      isNew: true
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#6B73FF', '#8E5CFF', '#A855F7']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <MaterialIcons name="health-and-safety" size={32} color="#FFF" />
            </View>
            <View style={styles.headerText}>
              <ThemedText style={styles.headerSubtitle}>
                Bebeğinizin sağlık verilerini takip edin
              </ThemedText>
            </View>
          </View>
        </LinearGradient>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.categoriesContainer}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  index % 2 === 0 ? styles.leftCard : styles.rightCard
                ]}
                onPress={() => router.push(category.route as any)}
                activeOpacity={0.8}
              >
                <View style={styles.cardContent}>
                  <View style={[styles.cardIcon, { backgroundColor: category.iconBackground }]}>
                    <MaterialIcons 
                      name={category.icon as any} 
                      size={28} 
                      color={category.gradientColors[0]} 
                    />
                  </View>
                  
                  {category.isNew && (
                    <View style={styles.newBadge}>
                      <ThemedText style={styles.newBadgeText}>YENİ</ThemedText>
                    </View>
                  )}
                  
                  <View style={styles.cardTextContainer}>
                    <ThemedText style={styles.cardTitle}>{category.title}</ThemedText>
                    <ThemedText style={styles.cardSubtitle}>{category.subtitle}</ThemedText>
                  </View>
                  
                  <View style={styles.cardArrow}>
                    <MaterialIcons name="chevron-right" size={24} color="#C7D2FE" />
                  </View>
                </View>
                
                {/* Subtle gradient overlay */}
                <LinearGradient
                  colors={[`${category.gradientColors[0]}05`, `${category.gradientColors[1]}10`]}
                  style={styles.cardGradientOverlay}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Quick Stats Section */}
          <View style={styles.quickStatsSection}>
            <ThemedText style={styles.sectionTitle}>Hızlı Erişim</ThemedText>
            <View style={styles.quickStatsGrid}>
              <TouchableOpacity 
                style={styles.quickStatCard}
                onPress={() => router.push('/health/development-guide')}
              >
                <View style={[styles.quickStatIcon, { backgroundColor: '#E0E7FF' }]}>
                  <MaterialIcons name="menu-book" size={24} color="#6366F1" />
                </View>
                <ThemedText style={styles.quickStatTitle}>Gelişim Rehberi</ThemedText>
                <ThemedText style={styles.quickStatSubtitle}>Aylık bilgiler</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickStatCard}
                onPress={() => router.push('/health')}
              >
                <View style={[styles.quickStatIcon, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialIcons name="timeline" size={24} color="#F59E0B" />
                </View>
                <ThemedText style={styles.quickStatTitle}>İstatistikler</ThemedText>
                <ThemedText style={styles.quickStatSubtitle}>Genel durum</ThemedText>
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
    backgroundColor: '#6B73FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
    paddingTop: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  leftCard: {
    marginRight: '2%',
  },
  rightCard: {
    marginLeft: '2%',
  },
  cardContent: {
    padding: 20,
    minHeight: 140,
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 2,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 3,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 20,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    fontWeight: '400',
  },
  cardArrow: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  quickStatsSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
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
  quickStatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickStatTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickStatSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});