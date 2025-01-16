import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useBabyContext } from '@/context/BabyContext';

export default function AllergyTrackerScreen() {
  const { babies } = useBabyContext();

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {babies.map((baby) => {
          const allergies = baby.allergy_information || [];
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
                      <MaterialIcons name="healing" size={16} color="#FFF" />
                      <ThemedText style={styles.badgeText}>
                        {allergies.length} Alerji
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>

              <View style={[styles.allergyContainer, { backgroundColor: genderBgColor }]}>
                {allergies.length === 0 ? (
                  <View style={styles.emptyState}>
                    <MaterialIcons name="healing" size={48} color={genderColor} />
                    <ThemedText style={[styles.emptyText, { color: genderColor }]}>
                      Henüz alerji kaydı bulunmuyor
                    </ThemedText>
                  </View>
                ) : (
                  <View style={styles.allergyList}>
                    {allergies.map((allergy, index) => (
                      <View key={index} style={styles.allergyCard}>
                        <View style={styles.cardHeader}>
                          <View style={[styles.iconContainer, { backgroundColor: genderColor }]}>
                            <MaterialIcons name="healing" size={24} color="#FFF" />
                          </View>
                          <View style={styles.headerInfo}>
                            <ThemedText style={styles.allergyName}>
                              {allergy.allergy_name}
                            </ThemedText>
                            <ThemedText style={styles.allergyDate}>
                              {format(new Date(allergy.discovery_date), 'd MMMM yyyy', { locale: tr })}
                            </ThemedText>
                          </View>
                        </View>
                        {allergy.symptoms && (
                          <View style={styles.symptomsContainer}>
                            <MaterialIcons name="info" size={16} color={genderColor} />
                            <ThemedText style={styles.symptomsText}>
                              {allergy.symptoms}
                            </ThemedText>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push({
          pathname: "/health/allergy-tracker/add"
        } as any)}
      >
        <MaterialIcons name="add" size={24} color="#FFF" />
        <ThemedText style={styles.addButtonText}>Alerji Ekle</ThemedText>
      </TouchableOpacity>
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
  allergyContainer: {
    padding: 16,
  },
  allergyList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  allergyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  allergyDate: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: Colors.light.tint,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  allergyCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  symptomsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  symptomsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
}); 