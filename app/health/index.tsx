import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const healthCategories = [
  {
    id: 'vaccines',
    title: 'Aşı Takibi',
    icon: 'medical-services' as const, // icon type hatası için as const ekledik
    description: 'Aşı kayıtları ve takibi',
    route: '/health/vaccine-tracker'
  },
  // Diğer kategoriler daha sonra eklenebilir
];

export default function HealthScreen() {
  return (
    <ThemedView style={styles.container}>
      {healthCategories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.card}
          onPress={() => router.push(category.route)}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name={category.icon} size={32} color="#4CAF50" />
          </View>
          <View style={styles.textContainer}>
            <ThemedText style={styles.title}>{category.title}</ThemedText>
            <ThemedText style={styles.description}>{category.description}</ThemedText>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});