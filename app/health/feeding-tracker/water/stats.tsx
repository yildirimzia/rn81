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

interface WaterFeeding {
  _id: string;
  startTime: Date;
  amount: number;
  notes?: string;
}

const formatName = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const StatsScreen = () => {
  const { babyId } = useLocalSearchParams<{ babyId: string }>();
  const { babies } = useBabyContext();
  const baby = babies.find(b => b.id === babyId);

  if (!baby) return null;

  const water = baby.water || [];

  // İstatistikleri hesapla
  const stats = {
    totalAmount: 0,
    averageAmount: 0,
    maxAmount: 0,
    totalCount: water.length,
    dailyStats: {} as { [key: string]: number }
  };

  // Son 7 günün verilerini hazırla
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  water.forEach((feeding: WaterFeeding) => {
    stats.totalAmount += feeding.amount;
    stats.maxAmount = Math.max(stats.maxAmount, feeding.amount);

    const date = new Date(feeding.startTime).toISOString().split('T')[0];
    stats.dailyStats[date] = (stats.dailyStats[date] || 0) + feeding.amount;
  });

  stats.averageAmount = stats.totalCount ? Math.round(stats.totalAmount / stats.totalCount) : 0;

  const lineChartData = {
    labels: last7Days.map(date => 
      format(new Date(date), 'dd MMM', { locale: tr })
    ),
    datasets: [{
      data: last7Days.map(date => stats.dailyStats[date] || 0),
      color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`,
      strokeWidth: 2,
    }]
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{formatName(baby.name)} - Su Takibi İstatistikleri</ThemedText>
        </View>

        <View style={styles.content}>
          {/* Özet Kartları */}
          <View style={styles.summaryCards}>
            <View style={[styles.summaryCard, { backgroundColor: '#FF69B4' }]}>
              <MaterialIcons name="local-drink" size={24} color="#FFF" />
              <ThemedText style={styles.summaryValue}>{stats.totalAmount} ml</ThemedText>
              <ThemedText style={styles.summaryLabel}>Toplam Su</ThemedText>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: '#4B7BEC' }]}>
              <MaterialIcons name="trending-up" size={24} color="#FFF" />
              <ThemedText style={styles.summaryValue}>{stats.averageAmount} ml</ThemedText>
              <ThemedText style={styles.summaryLabel}>Ortalama</ThemedText>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: '#FF8DA1' }]}>
              <MaterialIcons name="water" size={24} color="#FFF" />
              <ThemedText style={styles.summaryValue}>{stats.totalCount}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Toplam İçim</ThemedText>
            </View>
          </View>

          {/* Günlük Trend Grafiği */}
          <View style={styles.chartSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="timeline" size={24} color="#FF69B4" />
              <ThemedText style={styles.sectionTitle}>Günlük Su Tüketimi</ThemedText>
            </View>
            <View style={styles.chartContainer}>
              <LineChart
                data={lineChartData}
                width={Dimensions.get('window').width - 48}
                height={220}
                chartConfig={{
                  backgroundColor: '#FFF',
                  backgroundGradientFrom: '#FFF',
                  backgroundGradientTo: '#FFF',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#FF69B4"
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: "#F0F0F0",
                    strokeWidth: "1"
                  },
                  propsForLabels: {
                    fontSize: "12",
                    rotation: -45
                  }
                }}
                bezier
                style={{
                  ...styles.chart,
                  paddingRight: 40,
                  paddingTop: 10
                }}
                withVerticalLines={true}
                withHorizontalLines={true}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                segments={5}
                fromZero
                yAxisInterval={1}
                formatYLabel={(value) => Math.round(parseFloat(value)).toString()}
                getDotColor={(dataPoint, dataPointIndex) => {
                  return dataPoint > 0 ? "#FF69B4" : "#F0F0F0";
                }}
                renderDotContent={({ x, y, index, indexData }) => (
                  indexData > 0 ? (
                    <View key={index} style={{
                      position: 'absolute',
                      top: y - 24,
                      left: x - 12,
                    }}>
                      <ThemedText style={{
                        color: '#FF69B4',
                        fontSize: 12,
                        fontWeight: '600'
                      }}>
                        {indexData}ml
                      </ThemedText>
                    </View>
                  ) : null
                )}
              />
            </View>
            <View style={styles.chartLegend}>
              <ThemedText style={styles.chartLegendText}>
                Son 7 günde tüketilen su miktarı (ml)
              </ThemedText>
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
    backgroundColor: '#FFF',
  },
  header: {
    padding: 16,
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
