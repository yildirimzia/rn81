import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useBabyContext } from '@/context/BabyContext';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const BreastMilkScreen = () => {
  const { babies } = useBabyContext();
  const [expandedBaby, setExpandedBaby] = useState<string | null>(null);

  // İlk bebeğin kartını otomatik aç
  useEffect(() => {
    if (babies && babies.length > 0 && babies[0].id) {
      setExpandedBaby(babies[0].id);
    }
  }, [babies]);

  const handleBabyPress = (babyId: string | undefined) => {
    if (!babyId) return;
    setExpandedBaby(expandedBaby === babyId ? null : babyId);
  };

  const renderFeedingHistory = (breastMilk: any[]) => {
    // Debug için log ekleyelim
    console.log('Breast milk data:', breastMilk);

    if (!breastMilk || breastMilk.length === 0) {
      return (
        <View style={[styles.emptyState, { backgroundColor: '#FFF' }]}>
          <MaterialIcons name="child-care" size={48} color="#FF69B4" />
          <ThemedText style={styles.emptyStateText}>
            Henüz emzirme kaydı bulunmuyor
          </ThemedText>
        </View>
      );
    }

    return breastMilk.map((feeding, index) => (
      <View key={feeding._id || index} style={styles.feedingRecord}>
        <View style={styles.feedingTime}>
          <MaterialIcons name="schedule" size={20} color="#666" />
          <ThemedText style={styles.feedingTimeText}>
            {format(new Date(feeding.startTime), 'HH:mm', { locale: tr })}
          </ThemedText>
        </View>
        
        <View style={styles.feedingDetails}>
          <View style={styles.feedingDuration}>
            <MaterialIcons name="timer" size={20} color="#666" />
            <ThemedText style={styles.feedingDetailText}>
              {feeding.duration} dk
            </ThemedText>
          </View>
          
          <View style={styles.feedingBreast}>
            <MaterialIcons name="favorite" size={20} color="#666" />
            <ThemedText style={styles.feedingDetailText}>
              {feeding.breast === 'left' ? 'Sol' : 'Sağ'} Göğüs
            </ThemedText>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {babies?.map((baby, index) => {
          const cardColor = index % 2 === 0 ? '#FF69B4' : '#4B7BEC';
          const contentBgColor = index % 2 === 0 ? '#FFF5F9' : '#F5F8FF';
          
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
                        {baby.name}
                      </ThemedText>
                      <View style={styles.subtitleContainer}>
                        <MaterialIcons name="access-time" size={16} color="#FFF" />
                        <ThemedText style={styles.babySubtitle}>
                          Anne Sütü Takibi
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
                  <TouchableOpacity 
                    style={[styles.addButton, { backgroundColor: '#FFF' }]}
                    onPress={() => router.push({
                      pathname: '/health/feeding-tracker/breast-milk/breast_milk_add',
                      params: { babyId: baby.id }
                    })}
                  >
                    <ThemedText style={[styles.addButtonText, { color: cardColor }]}>
                      + Yeni Emzirme Kaydı Ekle
                    </ThemedText>
                  </TouchableOpacity>

                  <View style={styles.feedingList}>
                    {renderFeedingHistory(baby.breast_milk ?? [])}
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
  addButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
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
  feedingDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedingBreast: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedingDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
});

export default BreastMilkScreen;