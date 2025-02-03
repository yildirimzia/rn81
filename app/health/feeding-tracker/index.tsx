import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const FEEDING_CATEGORIES = [
  {
    id: 'breast_milk',
    title: 'Anne Sütü',
    icon: 'water-drop',
    gradientColors: ['#FF6B6B', '#EE5253']
  },
  {
    id: 'formula',
    title: 'Mama',
    icon: 'local-drink',
    gradientColors: ['#4B7BEC', '#3867D6']
  },
  {
    id: 'solid-food',
    title: 'Ek Gıda',
    icon: 'restaurant',
    gradientColors: ['#20BF6B', '#0FB9B1']
  },
  {
    id: 'water',
    title: 'Su',
    icon: 'local-drink',
    gradientColors: ['#45AAF2', '#2D98DA']
  },
  {
    id: 'supplement',
    title: 'Vitamin / Takviye',
    icon: 'medication',
    gradientColors: ['#FA8231', '#FC5C65']
  },
  {
    id: 'snacks',
    title: 'Atıştırmalıklar',
    icon: 'cookie',
    gradientColors: ['#A55EEA', '#8854D0']
  }
];

const FeedingTrackerScreen = () => {
  const router = useRouter();

  const handleCategorySelect = (categoryId: string) => {
    console.log('Selected category:', categoryId);
    switch (categoryId) {
      case 'breast_milk':
        router.push('/health/feeding-tracker/breast-milk/breast_milk' as any);
        break;
      case 'formula':
        router.push('/health/feeding-tracker/formula' as any);
        break;
      case 'solid-food':
        router.push('/health/feeding-tracker/solid-food' as any);
        break;
      case 'water':
        router.push('/health/feeding-tracker/water' as any);
        break;
      case 'supplement':
        router.push('/health/feeding-tracker/supplement' as any);
        break;
      case 'snacks':
        router.push('/health/feeding-tracker/snacks/index' as any);
        break;
      // Diğer kategoriler için de benzer şekilde...
      default:
        router.push(`/health/feeding-tracker/${categoryId}` as any);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.headerTitle}>Beslenme Takibi</ThemedText>
          <ThemedText style={styles.subtitle}>
            Bebeğinizin beslenme kayıtlarını kolayca yönetin
          </ThemedText>
        </View>
        <MaterialIcons name="restaurant" size={32} color="#FF5722" />
      </View>

      <FlatList
        data={FEEDING_CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCategorySelect(item.id)}
          >
            <LinearGradient 
              colors={item.gradientColors as any}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.iconContainer}>
                <MaterialIcons name={item.icon as any} size={32} color="#FFF" />
              </View>
              <View style={styles.cardContent}>
                <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
};

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
  subtitle: {
    fontSize: 16,
    color: '#666',
    maxWidth: '80%',
  },
  gridContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    height: 180,
    marginBottom: 16,
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
});

export default FeedingTrackerScreen;
