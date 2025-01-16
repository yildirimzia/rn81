import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const healthCategories = [
  {
    id: 'vaccines',
    title: 'Aşı Takibi',
    description: 'Aşı kayıtlarını görüntüle ve yönet',
    icon: 'vaccines' as const,
    route: '/health/vaccine-tracker',
    color: '#4A90E2',
    bgColor: '#E3F2FD'
  },
  {
    id: 'allergies',
    title: 'Alerji Takibi',
    description: 'Alerjileri ve reaksiyonları kaydet',
    icon: 'healing' as const,
    route: '/health/allergy-tracker',
    color: '#FF5252',
    bgColor: '#FFEBEE'
  }
];

export default function HealthScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Sağlık Takibi</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Bebeğinizin sağlık kayıtlarını kolayca yönetin
        </ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {healthCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.card, { backgroundColor: category.bgColor }]}
              onPress={() => router.push(category.route as any)}
            >
              <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
                <MaterialIcons name={category.icon} size={32} color="#FFF" />
              </View>
              <ThemedText style={styles.cardTitle}>{category.title}</ThemedText>
              <ThemedText style={styles.cardDescription}>
                {category.description}
              </ThemedText>
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
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
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
  },
  card: {
    width: '47%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});