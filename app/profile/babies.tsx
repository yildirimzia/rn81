import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { babyApi, IBabyData } from '@/services/api/baby';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function BabiesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [babies, setBabies] = useState<IBabyData[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBabies = async () => {
    try {
      const response = await babyApi.getBabies();
      if (response.data?.success) {
        setBabies(response.data.babies.map(baby => ({
          id: baby._id,
          name: baby.name,
          birthDate: baby.birthDate,
          gender: baby.gender,
          weight: baby.weight,
          height: baby.height,
          photo: baby.photo,
          snacks: [],
          breast_milk: [],
          formula: [],
          solid_food: [],
          water: [],
          supplement: [],
          growth_tracking: [],
          vaccine_information: [],
          allergy_information: [],
          teeth_information: []
        })));
      }
    } catch (error) {
      console.error('Bebekler yüklenirken hata:', error);
    }
  };

  useEffect(() => {
    fetchBabies();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBabies();
    setRefreshing(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <LinearGradient
          colors={[Colors[colorScheme ?? 'light'].tint, '#4A90E2']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="child-care" size={48} color="#FFF" />
            </View>
            <ThemedText style={styles.headerTitle}>Bebeklerim</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Bebeklerinizin gelişimini takip edin
            </ThemedText>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {babies.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="child-care" size={64} color="#666" />
              <ThemedText style={styles.emptyStateText}>
                Henüz bebek eklemediniz
              </ThemedText>
            </View>
          ) : (
            <View style={styles.babiesList}>
              {babies.map((baby) => (
                <TouchableOpacity
                  key={baby.id}
                  style={styles.babyCard}
                  onPress={() => router.push(`/baby/detail/${baby.id}`)}
                >
                  <View style={[
                    styles.babyAvatar,
                    { backgroundColor: baby.gender === 'female' ? 'rgba(255, 182, 193, 0.1)' : 'rgba(135, 206, 235, 0.1)' }
                  ]}>
                    {baby.photo?.url ? (
                      <Image source={{ uri: baby.photo.url }} style={styles.babyPhoto} />
                    ) : (
                      <MaterialIcons 
                        name="child-care" 
                        size={32} 
                        color={baby.gender === 'female' ? '#FF69B4' : '#4A90E2'} 
                      />
                    )}
                  </View>
                  <View style={styles.babyInfo}>
                    <ThemedText style={styles.babyName}>{baby.name}</ThemedText>
                    <ThemedText style={styles.babyDate}>
                      {new Date(baby.birthDate).toLocaleDateString('tr-TR')}
                    </ThemedText>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#666" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/baby/gender-select')}
        >
          <MaterialIcons name="add" size={24} color="#FFF" />
          <ThemedText style={styles.addButtonText}>Bebek Ekle</ThemedText>
        </TouchableOpacity>
      </View>
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
  headerGradient: {
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    marginTop: -32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyStateText: {
    marginTop: 16,
    marginBottom: 24,
    color: '#666',
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  babiesList: {
    marginTop: -32,
    gap: 12,
  },
  babyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  babyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  babyPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  babyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  babyName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  babyDate: {
    fontSize: 14,
    color: '#666',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
}); 