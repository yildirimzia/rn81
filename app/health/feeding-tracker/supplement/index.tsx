import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useBabyContext } from '@/context/BabyContext';
import { router, useFocusEffect } from 'expo-router';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { supplementApi } from '@/services/api/feeding/supplement';

const formatName = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const SupplementScreen = () => {
  const { babies, fetchBabies } = useBabyContext();
  const [expandedBaby, setExpandedBaby] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (babies && babies.length > 0 && babies[0].id) {
        setExpandedBaby(babies[0].id);
      }
    }, [babies])
  );

  const handleDeletePress = async (babyId: string, feedingId: string) => {
    Alert.alert(
      "Takviye Kaydını Sil",
      "Bu takviye kaydını silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await supplementApi.deleteFeeding(babyId, feedingId);
              fetchBabies();
            } catch (error) {
              Alert.alert('Hata', 'Takviye kaydı silinirken bir hata oluştu');
            }
          }
        }
      ]
    );
  };

  const handleBabyPress = (babyId: string | undefined) => {
    if (!babyId) return;
    setExpandedBaby(expandedBaby === babyId ? null : babyId);
  };

  const renderFeedingHistory = (supplement: any[], babyId: string) => {
    if (!supplement || supplement.length === 0) {
      return (
        <View style={[styles.emptyState, { backgroundColor: '#FFF' }]}>
          <MaterialIcons name="medical-services" size={48} color="#FF69B4" />
          <ThemedText style={styles.emptyStateText}>
            Henüz takviye kaydı bulunmuyor
          </ThemedText>
        </View>
      );
    }

    return supplement.map((feeding, index) => (
      <View key={feeding._id || index} style={styles.feedingItem}>
        <View style={styles.timeContainer}>
          <MaterialIcons name="schedule" size={20} color="#666" />
          <ThemedText style={styles.time} numberOfLines={1} ellipsizeMode="tail">
            {format(new Date(feeding.startTime), 'HH:mm', { locale: tr })}
          </ThemedText>
        </View>

        <View style={styles.typeContainer}>
          <MaterialIcons name="category" size={20} color="#666" />
          <ThemedText style={styles.type} numberOfLines={1} ellipsizeMode="tail">
            {feeding.supplementType.name}
          </ThemedText>
        </View>

        <View style={styles.amountContainer}>
          <MaterialIcons name="straighten" size={20} color="#666" />
          <ThemedText style={styles.amount} numberOfLines={1} ellipsizeMode="tail">
            {feeding.amount}
          </ThemedText>
        </View>

        {feeding.notes && (
          <View style={styles.notesContainer}>
            <MaterialIcons name="note" size={20} color="#666" />
            <ThemedText style={styles.notes} numberOfLines={1} ellipsizeMode="tail">
              {feeding.notes}
            </ThemedText>
          </View>
        )}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => feeding._id && handleDeletePress(babyId, feeding._id)}
        >
          <MaterialIcons name="delete-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {babies?.map((baby) => {
          if (!baby.id) return null;
          
          const cardColor = baby.gender === 'male' ? '#4B7BEC' : '#FF69B4';
          const contentBgColor = baby.gender === 'male' ? '#F5F8FF' : '#FFF5F9';
          
          return (
            <View key={baby.id}>
              <TouchableOpacity 
                style={[styles.babyCard, { backgroundColor: cardColor }]}
                onPress={() => handleBabyPress(baby.id)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.profileSection}>
                    <View style={styles.profileIcon}>
                      <MaterialIcons name="person" size={24} color="#FFF" />
                    </View>
                    <View style={styles.babyInfo}>
                      <ThemedText style={styles.babyName}>
                        {formatName(baby.name)}
                      </ThemedText>
                      <View style={styles.subtitleContainer}>
                        <MaterialIcons name="medical-services" size={16} color="#FFF" />
                        <ThemedText style={styles.babySubtitle}>
                          Takviye Takibi
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  <MaterialIcons 
                    name={expandedBaby === baby.id ? "expand-less" : "expand-more"} 
                    size={24} 
                    color="#FFF" 
                  />
                </View>
              </TouchableOpacity>

              {expandedBaby === baby.id && (
                <View style={[styles.expandedContent, { backgroundColor: contentBgColor }]}>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: '#FFF', flex: 1, marginRight: 8 }]}
                      onPress={() => router.push({
                        pathname: '/health/feeding-tracker/supplement/add',
                        params: { babyId: baby.id }
                      })}
                    >
                      <MaterialIcons name="add" size={20} color={cardColor} />
                      <ThemedText style={[styles.actionButtonText, { color: cardColor }]}>
                        Yeni Takviye Kaydı
                      </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: '#FFF', flex: 1, marginLeft: 8 }]}
                      onPress={() => router.push({
                        pathname: '/health/feeding-tracker/supplement/stats',
                        params: { babyId: baby.id }
                      })}
                    >
                      <MaterialIcons name="insert-chart" size={20} color={cardColor} />
                      <ThemedText style={[styles.actionButtonText, { color: cardColor }]}>
                        İstatistikler
                      </ThemedText>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.feedingList}>
                    {renderFeedingHistory(baby.supplement || [], baby.id)}
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  babyCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  babyInfo: {
    flex: 1,
  },
  babyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  babySubtitle: {
    fontSize: 14,
    color: '#FFF',
    marginLeft: 4,
  },
  expandedContent: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  feedingList: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  feedingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  time: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    marginRight: 8,
  },
  type: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
    flex: 1,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    marginRight: 8,
  },
  amount: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
    flex: 1,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notes: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default SupplementScreen;
