import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useBabyContext } from '@/context/BabyContext';
import { MaterialIcons } from '@expo/vector-icons';

const StatsScreen = () => {
  const { babyId } = useLocalSearchParams<{ babyId: string }>();
  const { babies } = useBabyContext();
  const baby = babies.find(b => b.id === babyId);

  if (!baby) return null;

  const breastMilk = baby.breast_milk || [];

  // İstatistikleri hesapla
  const stats = {
    totalDuration: 0,
    averageDuration: 0,
    leftBreastCount: 0,
    rightBreastCount: 0,
    maxDuration: 0,
    totalCount: breastMilk.length,
    dailyStats: {} as { [key: string]: number }
  };

  breastMilk.forEach(feeding => {
    stats.totalDuration += feeding.duration;
    stats.maxDuration = Math.max(stats.maxDuration, feeding.duration);
    if (feeding.breast === 'left') stats.leftBreastCount++;
    if (feeding.breast === 'right') stats.rightBreastCount++;

    const date = new Date(feeding.startTime).toISOString().split('T')[0];
    stats.dailyStats[date] = (stats.dailyStats[date] || 0) + feeding.duration;
  });

  stats.averageDuration = stats.totalCount ? stats.totalDuration / stats.totalCount : 0;

  const lineChartData = {
    labels: Object.keys(stats.dailyStats).slice(-6),
    datasets: [{
      data: Object.values(stats.dailyStats).slice(-6),
      color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`,
      strokeWidth: 2
    }]
  };

  const pieChartData = [
    {
      name: 'Sol Göğüs',
      population: stats.leftBreastCount,
      color: '#FF69B4',
      legendFontColor: '#7F7F7F',
    },
    {
      name: 'Sağ Göğüs',
      population: stats.rightBreastCount,
      color: '#4B7BEC',
      legendFontColor: '#7F7F7F',
    }
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{baby.name} - Emzirme İstatistikleri</ThemedText>
        </View>

        <View style={styles.content}>
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
                height={180}
                chartConfig={{
                  backgroundColor: '#FFF',
                  backgroundGradientFrom: '#FFF',
                  backgroundGradientTo: '#FFF',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#FF69B4'
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
                data={{
                  labels: Object.keys(stats.dailyStats).slice(-7),
                  datasets: [{
                    data: Object.values(stats.dailyStats).slice(-7)
                  }]
                }}
                width={Dimensions.get('window').width - 48}
                height={180}
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
              />
            </View>
          </View>

          {/* Göğüs Dağılımı */}
          <View style={styles.chartSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="pie-chart" size={24} color="#FF69B4" />
              <ThemedText style={styles.sectionTitle}>Göğüs Dağılımı</ThemedText>
            </View>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieChartData}
                width={Dimensions.get('window').width - 48}
                height={180}
                chartConfig={{
                  color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute={false}
                style={styles.chart}
              />
            </View>
          </View>

          {/* Özet İstatistikler */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Günlük Ortalama</ThemedText>
              <ThemedText style={styles.summaryValue}>{stats.averageDuration.toFixed(1)} dk</ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>En Uzun Süre</ThemedText>
              <ThemedText style={styles.summaryValue}>{stats.maxDuration} dk</ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Toplam Emzirme</ThemedText>
              <ThemedText style={styles.summaryValue}>{stats.totalCount} kez</ThemedText>
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default StatsScreen; 