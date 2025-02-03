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

  const solidFood = baby.solid_food || [];

  // İstatistikleri hesapla
  const stats = {
    totalCount: solidFood.length,
    categoryStats: {} as { [key: string]: number },
    dailyStats: {} as { [key: string]: number },
    mostCommonFood: '',
    maxCount: 0
  };

  // Kategori ve günlük istatistikleri hesapla
  const foodCounts: { [key: string]: number } = {};
  solidFood.forEach(feeding => {
    // Kategori istatistikleri
    const category = feeding.foodType.category;
    stats.categoryStats[category] = (stats.categoryStats[category] || 0) + 1;

    // Günlük istatistikler
    const date = new Date(feeding.startTime).toISOString().split('T')[0];
    stats.dailyStats[date] = (stats.dailyStats[date] || 0) + 1;

    // En çok verilen yiyecek
    const foodName = feeding.foodType.name;
    foodCounts[foodName] = (foodCounts[foodName] || 0) + 1;
    if (foodCounts[foodName] > stats.maxCount) {
      stats.maxCount = foodCounts[foodName];
      stats.mostCommonFood = foodName;
    }
  });

  // Son 7 günün verilerini hazırla
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

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

  const pieChartData = Object.entries(stats.categoryStats).map(([category, count]) => ({
    name: getCategoryLabel(category),
    population: count,
    color: getCategoryColor(category),
    legendFontColor: '#7F7F7F',
    legendFontSize: 14,
  }));

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{formatName(baby.name)} - Ek Gıda İstatistikleri</ThemedText>
        </View>

        <View style={styles.content}>
          {/* Özet Kartları */}
          <View style={styles.summaryCards}>
            <View style={[styles.summaryCard, { backgroundColor: '#FF69B4' }]}>
              <MaterialIcons name="restaurant" size={24} color="#FFF" />
              <ThemedText style={styles.summaryValue}>{stats.totalCount}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Toplam Öğün</ThemedText>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: '#4B7BEC' }]}>
              <MaterialIcons name="category" size={24} color="#FFF" />
              <ThemedText style={styles.summaryValue}>{Object.keys(stats.categoryStats).length}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Farklı Kategori</ThemedText>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: '#FF8DA1' }]}>
              <MaterialIcons name="favorite" size={24} color="#FFF" />
              <ThemedText style={styles.summaryValue} numberOfLines={1} ellipsizeMode="tail">
                {stats.mostCommonFood || '-'}
              </ThemedText>
              <ThemedText style={styles.summaryLabel}>En Çok Verilen</ThemedText>
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
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#FF69B4"
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '', // Düz çizgiler
                    stroke: "#F0F0F0",  // Açık gri arka plan çizgileri
                    strokeWidth: "1"
                  },
                  propsForLabels: {
                    fontSize: "12",
                    rotation: -45,
                    offset: 12
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
                        {indexData}
                      </ThemedText>
                    </View>
                  ) : null
                )}
              />
            </View>
            <View style={styles.chartLegend}>
              <ThemedText style={styles.chartLegendText}>
                Son 7 günde verilen öğün sayısı
              </ThemedText>
            </View>
          </View>

          {/* Kategori Dağılımı */}
          <View style={styles.chartSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="pie-chart" size={24} color="#FF69B4" />
              <ThemedText style={styles.sectionTitle}>Kategori Dağılımı</ThemedText>
            </View>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieChartData}
                width={Dimensions.get('window').width - 48}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

// Yardımcı fonksiyonlar
const getCategoryLabel = (category: string): string => {
  const labels: { [key: string]: string } = {
    fruit: 'Meyve',
    vegetable: 'Sebze',
    grain: 'Tahıl',
    protein: 'Protein',
    milk: 'Süt',
    food: 'Yiyecek',
    drink: 'İçecek',
    other: 'Diğer'
  };
  return labels[category] || category;
};

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    fruit: '#FF69B4',
    vegetable: '#4B7BEC',
    grain: '#FF8DA1',
    protein: '#84A4F6',
    milk: '#FFA07A',
    food: '#98FB98',
    drink: '#87CEEB',
    other: '#DDA0DD'
  };
  return colors[category] || '#999999';
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