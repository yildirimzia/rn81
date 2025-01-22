import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function HealthScreen() {
  const categories = [
    {
      id: 'vaccines',
      title: 'Aşı Takibi',
      subtitle: 'Aşı takvimini takip edin',
      icon: 'vaccines',
      route: '/health/vaccine-tracker',
      gradientColors: ['#4CAF50', '#2E7D32'] as const
    },
    {
      id: 'allergies',
      title: 'Alerji Takibi',
      subtitle: 'Alerjileri kaydedin',
      icon: 'healing',
      route: '/health/allergy-tracker',
      gradientColors: ['#FF9800', '#F57C00'] as const
    },
    {
      id: 'teeth',
      title: 'Diş Takibi',
      subtitle: 'Diş gelişimini takip edin',
      icon: 'face',
      route: '/health/teeth-tracker',
      gradientColors: ['#2196F3', '#1976D2'] as const
    },
    {
      id: 'feeding',
      title: 'Beslenme Takibi',
      subtitle: 'Beslenme kayıtlarınızı yönetin',
      icon: 'restaurant',
      route: '/health/feeding-tracker',
      gradientColors: ['#FF5722', '#E64A19'] as const
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.headerTitle}>Sağlık Takibi</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Bebeğinizin sağlık kayıtlarını kolayca yönetin
          </ThemedText>
        </View>
        <MaterialIcons name="health-and-safety" size={32} color="#2196F3" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.card}
              onPress={() => router.push(category.route as any)}
            >
              <LinearGradient
                colors={category.gradientColors}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name={category.icon as any} size={32} color="#FFF" />
                </View>
                <View style={styles.cardContent}>
                  <ThemedText style={styles.cardTitle}>{category.title}</ThemedText>
                  <ThemedText style={styles.cardDescription}>
                    {category.subtitle}
                  </ThemedText>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 32,
    paddingTop: 48,
    fontWeight: '800',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    maxWidth: '80%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    paddingTop: 8,
  },
  card: {
    width: cardWidth,
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  cardGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
});