import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, RefreshControl, SafeAreaView } from 'react-native';
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
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Header */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.scrollContent}
          >
            {babies.length === 0 ? (
              <View style={styles.emptyState}>
                <ThemedText style={styles.emptyStateTitle}>
                  Henüz bebek eklemediniz
                </ThemedText>
                <ThemedText style={styles.emptyStateSubtitle}>
                  İlk bebeğinizi ekleyerek başlayın
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
                      { backgroundColor: baby.gender === 'female' ? '#FFE4E6' : '#DBEAFE' }
                    ]}>
                      {baby.photo?.url ? (
                        <Image source={{ uri: baby.photo.url }} style={styles.babyPhoto} />
                      ) : (
                        <View style={styles.avatarPlaceholder}>
                          <ThemedText style={[
                            styles.avatarText,
                            { color: baby.gender === 'female' ? '#F472B6' : '#60A5FA' }
                          ]}>
                            {baby.name.charAt(0).toUpperCase()}
                          </ThemedText>
                        </View>
                      )}
                    </View>
                    <View style={styles.babyInfo}>
                      <ThemedText style={styles.babyName}>{baby.name}</ThemedText>
                      <ThemedText style={styles.babyDate}>
                        {new Date(baby.birthDate).toLocaleDateString('tr-TR')}
                      </ThemedText>
                      <View style={styles.genderBadge}>
                        <ThemedText style={styles.genderText}>
                          {baby.gender === 'female' ? 'Kız' : 'Erkek'}
                        </ThemedText>
                      </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Add Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/baby/gender-select')}
            >
              <ThemedText style={styles.addButtonText}>Bebek Ekle</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 40,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  babiesList: {
    gap: 16,
  },
  babyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  babyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  babyPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
  },
  babyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  babyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  babyDate: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  genderBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  genderText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F5F5F5',
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B8DEF',
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#5B8DEF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 