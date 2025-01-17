import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useBabyContext } from '@/context/BabyContext';

export default function TeethTrackerScreen() {
  const { babies } = useBabyContext();

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        {babies.map((baby) => {
          const genderColor = baby.gender === 'male' ? '#4A90E2' : '#FF69B4';
          const genderBgColor = baby.gender === 'male' ? '#E3F2FD' : '#FFF0F5';

          return (
            <View key={baby.id} style={styles.babySection}>
              <View style={[styles.babyHeader, { backgroundColor: genderColor }]}>
                <View style={styles.babyIconContainer}>
                  <MaterialIcons 
                    name={baby.gender === 'male' ? 'person' : 'person-outline'} 
                    size={32} 
                    color="#FFF"
                  />
                </View>
                <View style={styles.babyInfo}>
                  <ThemedText style={styles.babyName}>{baby.name}</ThemedText>
                  <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                      <MaterialIcons name="face" size={16} color="#FFF" />
                      <ThemedText style={styles.badgeText}>
                        Diş Gelişimi
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>

              <View style={[styles.teethContainer, { backgroundColor: genderBgColor }]}>
                <TouchableOpacity 
                  style={styles.addTeethButton}
                  onPress={() => router.push("/health/teeth-tracker/add")}
                >
                  <MaterialIcons name="add" size={24} color={genderColor} />
                  <ThemedText style={[styles.addTeethText, { color: genderColor }]}>
                    Yeni Diş Kaydı Ekle
                  </ThemedText>
                </TouchableOpacity>

                <View style={styles.teethList}>
                  {/* Buraya diş kayıtları gelecek */}
                  <View style={styles.emptyState}>
                    <MaterialIcons name="face" size={48} color={genderColor} />
                    <ThemedText style={[styles.emptyText, { color: genderColor }]}>
                      Henüz diş kaydı bulunmuyor
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 16,
  },
  babySection: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  babyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  babyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  babyInfo: {
    flex: 1,
  },
  babyName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 4,
  },
  teethContainer: {
    padding: 16,
  },
  addTeethButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
  },
  addTeethText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  teethList: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
  }
}); 