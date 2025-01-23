import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter , useLocalSearchParams} from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { LinearGradient } from 'expo-linear-gradient';
import { useBabyContext } from '@/context/BabyContext';
import { 
  breastMilkApi, 
  CreateBreastFeedingData, 
  BreastFeedingResponse 
} from '@/services/api/feeding/breast-milk';


type FeedingRecord = {
  id: string;
  time: Date;
  duration: number;
  breast: 'left' | 'right';
};

const BreastMilkAddScreen = () => {
  const { babyId } = useLocalSearchParams<{ babyId: string }>();
  const router = useRouter();
  const { activeChild, fetchBabies } = useBabyContext();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration, setDuration] = useState(15); // dakika cinsinden
  const [selectedBreast, setSelectedBreast] = useState<'left' | 'right' | null>(null);
  const [feedingData, setFeedingData] = useState<BreastFeedingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Beslenme kayıtlarını getir
  const fetchFeedings = async () => {
    if (!activeChild?.id) return;
    
    try {
      setLoading(true);
      const response = await breastMilkApi.getFeedings({
        babyId: activeChild.id
      });
      if (response.data) {
        setFeedingData(response.data);
      }
    } catch (error) {
      console.error('Beslenme kayıtları alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  // Yeni kayıt ekle
  const handleSubmit = async () => {
    if (!selectedBreast) {
      console.error('Lütfen göğüs seçimi yapın');
      return;
    }

    try {
      await breastMilkApi.createFeeding({
        babyId,
        startTime: date,
        duration: Number(duration),
        breast: selectedBreast,
        feedingType: 'breast_milk'
      });
      
      await fetchBabies();  // Context'i güncelle
      router.back();
    } catch (error) {
      Alert.alert('Hata', 'Emzirme kaydı eklenirken bir hata oluştu');
    }
  };

  useEffect(() => {
    fetchFeedings();
  }, [activeChild?.id]);

  // Grafik verilerini hazırla
  const chartData = React.useMemo(() => {
    if (!feedingData) return null;

    const { feedings, stats } = feedingData;
    
    return {
      lineChartData: {
        labels: Object.keys(stats.dailyStats).slice(-6),
        datasets: [{
          data: Object.values(stats.dailyStats).slice(-6),
          color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`,
          strokeWidth: 2
        }]
      },
      pieChartData: [
        {
          name: 'Sol Göğüs',
          population: (stats.leftBreastCount / (stats.leftBreastCount + stats.rightBreastCount)) * 100,
          color: '#FF69B4',
          legendFontColor: '#666',
          legendFontSize: 14
        },
        {
          name: 'Sağ Göğüs',
          population: (stats.rightBreastCount / (stats.leftBreastCount + stats.rightBreastCount)) * 100,
          color: '#FF8DA1',
          legendFontColor: '#666',
          legendFontSize: 14
        }
      ]
    };
  }, [feedingData]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tarih Seçimi */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="schedule" size={24} color="#FF69B4" />
            <ThemedText style={styles.sectionTitle}>Emzirme Zamanı</ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialIcons name="event" size={24} color="#666" />
            <ThemedText style={styles.dateText}>
              {format(date, 'dd MMMM yyyy HH:mm', { locale: tr })}
            </ThemedText>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        {/* Süre Seçimi */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="timer" size={24} color="#FF69B4" />
            <ThemedText style={styles.sectionTitle}>Emzirme Süresi</ThemedText>
          </View>
          <View style={styles.durationContainer}>
            <TouchableOpacity 
              style={styles.durationButton}
              onPress={() => setDuration(Math.max(1, duration - 1))}
            >
              <LinearGradient
                colors={['#FF69B4', '#FF8DA1']}
                style={styles.gradientButton}
              >
                <MaterialIcons name="remove" size={24} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
            <View style={styles.durationDisplay}>
              <ThemedText style={styles.durationText}>{duration}</ThemedText>
              <ThemedText style={styles.durationUnit}>dakika</ThemedText>
            </View>
            <TouchableOpacity 
              style={styles.durationButton}
              onPress={() => setDuration(Math.min(60, duration + 1))}
            >
              <LinearGradient
                colors={['#FF69B4', '#FF8DA1']}
                style={styles.gradientButton}
              >
                <MaterialIcons name="add" size={24} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Göğüs Seçimi */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="favorite" size={24} color="#FF69B4" />
            <ThemedText style={styles.sectionTitle}>Emzirilen Göğüs</ThemedText>
          </View>
          <View style={styles.breastSelection}>
            <TouchableOpacity 
              style={[
                styles.breastButton,
                selectedBreast === 'left' && styles.selectedBreastButton
              ]}
              onPress={() => setSelectedBreast('left')}
            >
              <LinearGradient
                colors={selectedBreast === 'left' ? ['#FF69B4', '#FF8DA1'] : ['#F8F9FA', '#F8F9FA']}
                style={styles.breastGradient}
              >
                <ThemedText style={[
                  styles.breastButtonText,
                  selectedBreast === 'left' && styles.selectedBreastButtonText
                ]}>
                  Sol Göğüs
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.breastButton,
                selectedBreast === 'right' && styles.selectedBreastButton
              ]}
              onPress={() => setSelectedBreast('right')}
            >
              <LinearGradient
                colors={selectedBreast === 'right' ? ['#FF69B4', '#FF8DA1'] : ['#F8F9FA', '#F8F9FA']}
                style={styles.breastGradient}
              >
                <ThemedText style={[
                  styles.breastButtonText,
                  selectedBreast === 'right' && styles.selectedBreastButtonText
                ]}>
                  Sağ Göğüs
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* Kaydet Butonu */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSubmit}
          disabled={isSaving || !selectedBreast}
        >
          <LinearGradient
            colors={['#FF69B4', '#FF8DA1']}
            style={styles.saveGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <ThemedText style={styles.saveButtonText}>
              {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  durationButton: {
    width: 48,
    height: 48,
  },
  gradientButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationDisplay: {
    marginHorizontal: 24,
    alignItems: 'center',
  },
  durationText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333',
    paddingTop: 10,
  },
  durationUnit: {
    fontSize: 14,
    color: '#666',
  },
  breastSelection: {
    flexDirection: 'row',
    gap: 12,
  },
  breastButton: {
    flex: 1,
    height: 56,
    overflow: 'hidden',
    borderRadius: 12,
  },
  breastGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBreastButton: {
    borderWidth: 0,
  },
  breastButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  selectedBreastButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  saveButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  saveGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  feedingRecord: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  feedingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  feedingTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
  feedingIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  percentageContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default BreastMilkAddScreen; 