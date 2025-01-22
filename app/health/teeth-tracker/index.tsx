import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useBabyContext } from '@/context/BabyContext';
import { useState } from 'react';

export default function TeethTrackerScreen() {
  const { babies, deleteTeeth } = useBabyContext();
  const [expandedBabyId, setExpandedBabyId] = useState<string | null>(null);

  const toggleExpand = (babyId: string | undefined) => {
    if (!babyId) return;
    setExpandedBabyId(expandedBabyId === babyId ? null : babyId);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {babies.map((baby) => (
          <View key={baby.id} style={styles.babySection}>
            <TouchableOpacity 
              style={[styles.babyHeader, { 
                backgroundColor: baby.gender === 'male' ? '#4A90E2' : '#FF69B4' 
              }]}
              onPress={() => toggleExpand(baby.id)}
            >
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
              <MaterialIcons 
                name={expandedBabyId === baby.id ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={24} 
                color="#FFF"
              />
            </TouchableOpacity>

            {expandedBabyId === baby.id && (
              <View style={[styles.teethContainer, { 
                backgroundColor: baby.gender === 'male' ? '#E3F2FD' : '#FFF0F5' 
              }]}>
                <TouchableOpacity 
                  style={styles.addTeethButton}
                  onPress={() => router.push({
                    pathname: '/health/teeth-tracker/add',
                    params: { babyId: baby.id }
                  })}
                >
                  <MaterialIcons 
                    name="add" 
                    size={24} 
                    color={baby.gender === 'male' ? '#4A90E2' : '#FF69B4'} 
                  />
                  <ThemedText style={[styles.addTeethText, { 
                    color: baby.gender === 'male' ? '#4A90E2' : '#FF69B4' 
                  }]}>
                    Yeni Diş Kaydı Ekle
                  </ThemedText>
                </TouchableOpacity>

                <View style={styles.teethList}>
                  {baby.teeth_information && baby.teeth_information.length > 0 ? (
                    baby.teeth_information.map((tooth, index) => (
                      <View key={tooth.tooth_id || index} style={styles.teethCard}>
                        <View style={styles.teethContent}>
                          <View>
                            <ThemedText style={styles.teethName}>
                              {tooth.tooth_name}
                            </ThemedText>
                            <ThemedText style={styles.teethType}>
                              {tooth.tooth_type}
                            </ThemedText>
                            <ThemedText style={styles.teethDate}>
                              {format(new Date(tooth.date), 'd MMMM yyyy', { locale: tr })}
                            </ThemedText>
                          </View>
                          <TouchableOpacity
                            style={[styles.deleteButton, { 
                              backgroundColor: baby.gender === 'male' ? '#E3F2FD' : '#FFF0F5' 
                            }]}
                            onPress={() => {
                              if (tooth.tooth_id && baby.id) {
                                deleteTeeth(baby.id, tooth.tooth_id);
                              }
                            }}
                          >
                            <MaterialIcons
                              name="delete-outline"
                              size={24}
                              color={baby.gender === 'male' ? '#4A90E2' : '#FF69B4'}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <MaterialIcons 
                        name="face" 
                        size={48} 
                        color={baby.gender === 'male' ? '#4A90E2' : '#FF69B4'} 
                      />
                      <ThemedText style={[styles.emptyText, { 
                        color: baby.gender === 'male' ? '#4A90E2' : '#FF69B4' 
                      }]}>
                        Henüz diş kaydı bulunmuyor
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  babySection: {
    margin: 16,
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
  teethCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    marginBottom: 8,
  },
  teethContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teethName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  teethType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  teethDate: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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