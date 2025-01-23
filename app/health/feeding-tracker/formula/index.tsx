import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useBabyContext } from '@/context/BabyContext';
import { router, useFocusEffect } from 'expo-router';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { formulaApi } from '@/services/api/feeding/formula';

const formatName = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const FormulaScreen = () => {
  const { babies, fetchBabies } = useBabyContext();
  const [expandedBaby, setExpandedBaby] = useState<string | null>(null);

  // babies değiştiğinde expanded baby'i güncelle
  useFocusEffect(
    React.useCallback(() => {
      if (babies && babies.length > 0 && babies[0].id) {
        setExpandedBaby(babies[0].id);
      }
    }, [babies])
  );
  const handleDeletePress = async (babyId: string, feedingId: string) => {
    Alert.alert(
      "Mama Kaydını Sil",
      "Bu mama kaydını silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await formulaApi.deleteFeeding(babyId, feedingId);
              fetchBabies();  // Silme işleminden sonra güncelle
            } catch (error) {
              Alert.alert('Hata', 'Mama kaydı silinirken bir hata oluştu');
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

  const renderFeedingHistory = (formulaMilk: any[], babyId: string) => {
    console.log('Baby formula data:', formulaMilk); // Debug için
    
    if (!formulaMilk || formulaMilk.length === 0) {
      return (
        <View style={[styles.emptyState, { backgroundColor: '#FFF' }]}>
          <MaterialIcons name="baby-changing-station" size={48} color="#FF69B4" />
          <ThemedText style={styles.emptyStateText}>
            Henüz mama kaydı bulunmuyor
          </ThemedText>
        </View>
      );
    }

    return formulaMilk.map((feeding, index) => (
      <View key={feeding._id || index} style={styles.feedingRecord}>
        <View style={styles.feedingTime}>
          <MaterialIcons name="schedule" size={20} color="#666" />
          <ThemedText style={styles.feedingTimeText}>
            {format(new Date(feeding.startTime), 'HH:mm', { locale: tr })}
          </ThemedText>
        </View>
        
        <View style={styles.feedingDetails}>
          <View style={styles.feedingAmount}>
            <MaterialIcons name="local-drink" size={20} color="#666" />
            <ThemedText style={styles.feedingDetailText}>
              {feeding.amount} ml
            </ThemedText>
          </View>
          
          <View style={styles.feedingBrand}>
            <MaterialIcons name="label" size={20} color="#666" />
            <ThemedText style={styles.feedingDetailText}>
              {feeding.brand}
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => feeding._id && handleDeletePress(babyId, feeding._id)}
        >
          <MaterialIcons name="delete-outline" size={20} color="#FF6B6B" />
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
                        <MaterialIcons name="baby-changing-station" size={16} color="#FFF" />
                        <ThemedText style={styles.babySubtitle}>
                          Mama Takibi
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
                        pathname: '/health/feeding-tracker/formula/add',
                        params: { babyId: baby.id }
                      })}
                    >
                      <MaterialIcons name="add" size={20} color={cardColor} />
                      <ThemedText style={[styles.actionButtonText, { color: cardColor }]}>
                        Yeni Mama Kaydı
                      </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: '#FFF', flex: 1, marginLeft: 8 }]}
                      onPress={() => router.push({
                        pathname: '/health/feeding-tracker/formula/add',
                        params: { babyId: baby.id }
                      })}
                    >
                      <MaterialIcons name="bar-chart" size={20} color={cardColor} />
                      <ThemedText style={[styles.actionButtonText, { color: cardColor }]}>
                        İstatistikler
                      </ThemedText>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.feedingList}>
                    {renderFeedingHistory(baby.formula ?? [], baby.id)}
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
    backgroundColor: '#FFF',
  },
  babyCard: {
    margin: 16,
    marginBottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
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
  feedingList: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  feedingRecord: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
  },
  feedingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  feedingTimeText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  feedingDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedingAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedingBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedingDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default FormulaScreen;