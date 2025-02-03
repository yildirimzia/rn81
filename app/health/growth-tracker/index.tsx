import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useBabyContext } from '@/context/BabyContext';
import { router, useFocusEffect } from 'expo-router';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { growthApi } from '@/services/api/growth';

const formatName = (name: string | undefined) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const GrowthTrackerScreen = () => {
  const { babies, fetchBabies } = useBabyContext();
  const [expandedBaby, setExpandedBaby] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setRefreshing(true);
      await fetchBabies();
      if (expandedBaby) {
        const response = await growthApi.getRecords(expandedBaby);
        if (response.data?.records) {
          setRecords(response.data.records);
        }
      }
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [expandedBaby])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (babies && babies.length > 0 && babies[0].id) {
        setExpandedBaby(babies[0].id);
      }
    }, [babies])
  );

  const handleDeletePress = async (babyId: string, recordId: string) => {
    Alert.alert(
      "Büyüme Kaydını Sil",
      "Bu büyüme kaydını silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await growthApi.deleteRecord(babyId, recordId);
              loadData(); // Silme işleminden sonra verileri yenile
            } catch (error) {
              Alert.alert('Hata', 'Büyüme kaydı silinirken bir hata oluştu');
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

  const renderGrowthHistory = (babyId: string | undefined) => {
    if (!babyId) return null;
    if (!records || records.length === 0) {
      return (
        <View style={[styles.emptyState, { backgroundColor: '#FFF' }]}>
          <MaterialIcons name="straighten" size={48} color="#4CAF50" />
          <ThemedText style={styles.emptyStateText}>
            Henüz büyüme kaydı bulunmuyor
          </ThemedText>
        </View>
      );
    }

    const sortedRecords = [...records].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return sortedRecords.map((record, index) => (
      <View key={record._id || index} style={styles.recordItem}>
        <View style={styles.dateContainer}>
          <MaterialIcons name="event" size={20} color="#666" />
          <ThemedText style={styles.date}>
            {format(new Date(record.date), 'dd MMM yyyy', { locale: tr })}
          </ThemedText>
        </View>

        <View style={styles.measureContainer}>
          <MaterialIcons name="straighten" size={20} color="#666" />
          <ThemedText style={styles.measure}>
            {record.height} cm
          </ThemedText>
        </View>

        <View style={styles.weightContainer}>
          <MaterialIcons name="fitness-center" size={20} color="#666" />
          <ThemedText style={styles.weight}>
            {record.weight} kg
          </ThemedText>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => record._id && handleDeletePress(babyId, record._id)}
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
          const isExpanded = expandedBaby === baby.id;
          const cardColor = baby.gender === 'female' ? '#FF69B4' : '#4A90E2';

          return (
            <View key={baby.id} style={[styles.babyCard, { backgroundColor: cardColor }]}>
              <TouchableOpacity
                style={styles.babyHeader}
                onPress={() => handleBabyPress(baby.id)}
              >
                <View style={styles.headerLeft}>
                  <MaterialIcons name="child-care" size={24} color="#FFF" />
                  <ThemedText style={[styles.babyName, { color: '#FFF' }]}>
                    {formatName(baby.name)}
                  </ThemedText>
                  <ThemedText style={[styles.babySubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
                    Boy & Kilo Takibi
                  </ThemedText>
                </View>
                <MaterialIcons
                  name={isExpanded ? 'expand-less' : 'expand-more'}
                  size={24}
                  color="#FFF"
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: '#FFF', flex: 1, marginRight: 8 }]}
                      onPress={() => router.push({
                        pathname: '/health/growth-tracker/add',
                        params: { babyId: baby.id }
                      })}
                    >
                      <MaterialIcons name="add" size={20} color={cardColor} />
                      <ThemedText style={[styles.actionButtonText, { color: cardColor }]}>
                        Yeni Kayıt
                      </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: '#FFF', flex: 1, marginLeft: 8 }]}
                      onPress={() => router.push({
                        pathname: '/health/growth-tracker/stats',
                        params: { babyId: baby.id }
                      })}
                    >
                      <MaterialIcons name="insert-chart" size={20} color={cardColor} />
                      <ThemedText style={[styles.actionButtonText, { color: cardColor }]}>
                        İstatistikler
                      </ThemedText>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.recordList}>
                    {baby.id && renderGrowthHistory(baby.id)}
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
    borderRadius: 16,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  babyName: {
    fontSize: 20,
    fontWeight: '600',
  },
  babySubtitle: {
    fontSize: 14,
  },
  expandedContent: {
    backgroundColor: '#FFF',
    padding: 16,
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  recordList: {
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  date: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  measureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  measure: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  weight: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default GrowthTrackerScreen; 