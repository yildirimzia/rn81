import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';
import { babyApi } from '@/services/api/baby';
import { router } from 'expo-router';

export default function BabyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const [baby, setBaby] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBabyDetails = async () => {
      try {
        const response = await babyApi.getBabyById(id);
        if (response.data?.success) {
          setBaby(response.data.baby);
        }
      } catch (error) {
        console.error('Bebek detayları yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBabyDetails();
    }
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Bebeği Sil',
      'Bu bebeği silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await babyApi.deleteBaby(id);
              if (response.data?.success) {
                router.back();
              }
            } catch (error) {
              Alert.alert('Hata', 'Bebek silinirken bir hata oluştu');
              console.error('Bebek silinirken hata:', error);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <MaterialIcons name="child-care" size={48} color="#666" />
        <ThemedText style={styles.loadingText}>Yükleniyor...</ThemedText>
      </ThemedView>
    );
  }

  if (!baby) {
    return (
      <ThemedView style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#666" />
        <ThemedText style={styles.errorText}>Bebek bulunamadı</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={[Colors[colorScheme ?? 'light'].tint, '#4A90E2']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={[
              styles.photoContainer,
              { backgroundColor: baby.gender === 'female' ? 'rgba(255, 182, 193, 0.1)' : 'rgba(135, 206, 235, 0.1)' }
            ]}>
              {baby.photo?.url ? (
                <Image source={{ uri: baby.photo.url }} style={styles.photo} />
              ) : (
                <MaterialIcons 
                  name="child-care" 
                  size={48} 
                  color={baby.gender === 'female' ? '#FF69B4' : '#4A90E2'} 
                />
              )}
            </View>
            <ThemedText style={styles.name}>{baby.name}</ThemedText>
            <ThemedText style={styles.birthDate}>
              {new Date(baby.birthDate).toLocaleDateString('tr-TR')}
            </ThemedText>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="straighten" size={24} color="#666" />
              <ThemedText style={styles.infoLabel}>Boy:</ThemedText>
              <ThemedText style={styles.infoValue}>{baby.height} cm</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="fitness-center" size={24} color="#666" />
              <ThemedText style={styles.infoLabel}>Kilo:</ThemedText>
              <ThemedText style={styles.infoValue}>{baby.weight} gr</ThemedText>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <MaterialIcons 
              name="delete-outline" 
              size={18} 
              color={Colors[colorScheme ?? 'light'].danger ?? '#DC3545'} 
            />
            <ThemedText style={styles.deleteButtonText}>Bebeği Sil</ThemedText>
          </TouchableOpacity>
        </View>
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
  headerGradient: {
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  birthDate: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
  },
  content: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginTop: -32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 'auto',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 24,
    gap: 8,
    opacity: 0.8,
  },
  deleteButtonText: {
    fontSize: 14,
    color: Colors.light.danger,
  },
}); 