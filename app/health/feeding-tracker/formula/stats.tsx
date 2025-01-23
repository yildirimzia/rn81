import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
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
  

const StatsScreen = () => {
  const { babyId } = useLocalSearchParams<{ babyId: string }>();
  const { babies } = useBabyContext();
  const baby = babies.find(b => b.id === babyId);

  if (!baby) return null;

  const formula = baby.formula || [];

  // İstatistikleri hesapla
  const stats = {
    totalDuration: 0,
    averageDuration: 0,
    leftBreastCount: 0,
    rightBreastCount: 0,
    maxDuration: 0,
    totalCount: formula.length,
    dailyStats: {} as { [key: string]: number }
  };

  formula.forEach(feeding => {
    stats.totalDuration += feeding.amount;
    stats.maxDuration = Math.max(stats.maxDuration, feeding.amount);
    if (feeding.brand === 'left') stats.leftBreastCount++;
    if (feeding.brand === 'right') stats.rightBreastCount++;

    const date = new Date(feeding.startTime).toISOString().split('T')[0];
    stats.dailyStats[date] = (stats.dailyStats[date] || 0) + feeding.amount;
  });

  stats.averageDuration = stats.totalCount ? stats.totalDuration / stats.totalCount : 0;

  const lineChartData = {
    labels: Object.keys(stats.dailyStats).slice(-7).map(date => 
      format(new Date(date), 'dd MMM', { locale: tr })
    ),
    datasets: [{
      data: Object.values(stats.dailyStats).slice(-7),
      color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`,
      strokeWidth: 2,
    }]
  };

  const barChartData = {
    labels: Object.keys(stats.dailyStats).slice(-7).map(date => 
      format(new Date(date), 'dd MMM', { locale: tr })
    ),
    datasets: [{
      data: Object.values(stats.dailyStats).slice(-7),
      colors: [
        (opacity = 1) => `rgba(255, 105, 180, ${opacity})`,
        (opacity = 1) => `rgba(75, 123, 236, ${opacity})`,
        (opacity = 1) => `rgba(255, 141, 161, ${opacity})`,
        (opacity = 1) => `rgba(132, 164, 246, ${opacity})`,
        (opacity = 1) => `rgba(255, 105, 180, ${opacity})`,
        (opacity = 1) => `rgba(75, 123, 236, ${opacity})`,
        (opacity = 1) => `rgba(255, 141, 161, ${opacity})`
      ]
    }]
  };

  const pieChartData = [
    {
      name: 'Sol Göğüs',
      population: stats.leftBreastCount,
      color: '#FF69B4',
      legendFontColor: '#7F7F7F',
      legendFontSize: 14,
    },
    {
      name: 'Sağ Göğüs',
      population: stats.rightBreastCount,
      color: '#4B7BEC',
      legendFontColor: '#7F7F7F',
      legendFontSize: 14
    }
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{formatName(baby.name)} - Emzirme İstatistikleri</ThemedText>
        </View>

        <View style={styles.content}>
          {/* Özet Kartları */}
          <View style={styles.summaryCards}>
            <View style={[styles.summaryCard, { backgroundColor: '#FF69B4' }]}>
              <MaterialIcons name="access-time" size={24} color="#FFF" />
              <ThemedText style={styles.summaryValue}>{stats.totalDuration} dk</ThemedText>
              <ThemedText style={styles.summaryLabel}>Toplam Süre</ThemedText>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: '#4B7BEC' }]}>
              <MaterialIcons name="trending-up" size={24} color="#FFF" />
              <ThemedText style={styles.summaryValue}>{stats.averageDuration.toFixed(1)} dk</ThemedText>
              <ThemedText style={styles.summaryLabel}>Ortalama Süre</ThemedText>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: '#FF8DA1' }]}>
              <MaterialIcons name="repeat" size={24} color="#FFF" />
              <ThemedText style={styles.summaryValue}>{stats.totalCount}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Toplam Emzirme</ThemedText>
            </View>
          </View>

          {/* Günlük Trend Grafiği */}
          <View style={styles.chartSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="timeline" size={24} color="#FF69B4" />
              <ThemedText style={styles.sectionTitle}>Günlük Trend</ThemedText>
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
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#FF69B4"
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: '#F0F0F0',
                  }
                }}
                bezier
                style={styles.chart}
                withVerticalLines={false}
                withHorizontalLines={true}
                yAxisSuffix=" dk"
                segments={4}
                fromZero
              />
            </View>
          </View>

          {/* Haftalık Özet */}
          <View style={styles.chartSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="bar-chart" size={24} color="#FF69B4" />
              <ThemedText style={styles.sectionTitle}>Haftalık Özet</ThemedText>
            </View>
            <View style={styles.chartContainer}>
              <BarChart
                data={barChartData}
                width={Dimensions.get('window').width - 48}
                height={220}
                yAxisLabel=""
                yAxisSuffix=" dk"
                chartConfig={{
                  backgroundColor: '#FFF',
                  backgroundGradientFrom: '#FFF',
                  backgroundGradientTo: '#FFF',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  barPercentage: 0.7,
                }}
                style={styles.chart}
                showValuesOnTopOfBars={true}
                fromZero
              />
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
});

export default StatsScreen; 