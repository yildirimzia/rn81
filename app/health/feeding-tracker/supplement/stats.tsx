import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { useBabyContext } from '@/context/BabyContext';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const formatName = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

interface SupplementStats {
  [key: string]: {
    count: number;
    types: { [key: string]: number };
  };
}

const StatsScreen = () => {
  const { babyId } = useLocalSearchParams<{ babyId: string }>();
  const { babies } = useBabyContext();
  const baby = babies.find(b => b.id === babyId);

  if (!baby) return null;

  const supplement = baby.supplement || [];

  // Son 7 günün verilerini hazırla
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  // İstatistikleri hesapla
  const stats: SupplementStats = {};
  let totalCount = 0;
  let mostUsedType = { name: '', count: 0 };

  supplement.forEach(feeding => {
    const date = new Date(feeding.startTime).toISOString().split('T')[0];
    
    if (!stats[date]) {
      stats[date] = { count: 0, types: {} };
    }
    
    stats[date].count++;
    totalCount++;

    const typeName = feeding.supplementType.name;
    stats[date].types[typeName] = (stats[date].types[typeName] || 0) + 1;

    // En çok kullanılan takviyeyi bul
    const currentTypeTotal = Object.values(stats).reduce((sum, dayStats) => 
      sum + (dayStats.types[typeName] || 0), 0);
    
    if (currentTypeTotal > mostUsedType.count) {
      mostUsedType = { name: typeName, count: currentTypeTotal };
    }
  });

  const lineChartData = {
    labels: last7Days.map(date => 
      format(new Date(date), 'dd MMM', { locale: tr })
    ),
    datasets: [{
      data: last7Days.map(date => stats[date]?.count || 0),
      color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`,
      strokeWidth: 2,
    }]
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{formatName(baby.name)} - Takviye İstatistikleri</ThemedText>
        </View>

        <View style={styles.content}>
          {/* Özet Kartları */}
          <View style={styles.summaryCards}>
            <View style={[styles.summaryCard, { backgroundColor: '#FF69B4' }]}>
              <MaterialIcons name="medical-services" size={24} color="#FFF" />
              <ThemedText style={styles.summaryValue}>{totalCount}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Toplam Takviye</ThemedText>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: '#4B7BEC' }]}>
              <MaterialIcons name="star" size={24} color="#FFF" />
              <ThemedText style={styles.summaryValue}>{mostUsedType.name || '-'}</ThemedText>
              <ThemedText style={styles.summaryLabel}>En Sık Kullanılan</ThemedText>
            </View>
          </View>

          {/* Grafik */}
          <View style={styles.chartSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="insert-chart" size={24} color="#333" />
              <ThemedText style={styles.sectionTitle}>Son 7 Gün</ThemedText>
            </View>

            <View style={styles.chartContainer}>
              <LineChart
                data={lineChartData}
                width={Dimensions.get('window').width - 64}
                height={220}
                chartConfig={{
                  backgroundColor: '#FFF',
                  backgroundGradientFrom: '#FFF',
                  backgroundGradientTo: '#FFF',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                bezier
                style={styles.chart}
              />
              <View style={styles.chartLegend}>
                <ThemedText style={styles.chartLegendText}>
                  Günlük takviye sayısı
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
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
  chartSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginVertical: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.9,
  },
  chartLegend: {
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  chartLegendText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default StatsScreen;
