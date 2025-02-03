import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { useBabyContext } from '@/context/BabyContext';
import { MaterialIcons } from '@expo/vector-icons';
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

const StatsScreen = () => {
  const { babyId } = useLocalSearchParams<{ babyId: string }>();
  const { babies } = useBabyContext();
  const [records, setRecords] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const baby = babies.find(b => b.id === babyId);
  const cardColor = baby?.gender === 'female' ? '#FF69B4' : '#4A90E2';

  const loadData = async () => {
    try {
      setRefreshing(true);
      const response = await growthApi.getRecords(babyId as string);
      if (response.data?.records) {
        setRecords(response.data.records);
      }
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (babyId) {
        loadData();
      }
    }, [babyId])
  );

  if (!baby) return null;

  // İstatistikleri hesapla
  const stats = {
    currentWeight: records.length > 0 ? Number(records[records.length - 1].weight) || 0 : 0,
    currentHeight: records.length > 0 ? Number(records[records.length - 1].height) || 0 : 0,
    weightGain: records.length > 1 ? 
      (Number(records[records.length - 1].weight) || 0) - (Number(records[0].weight) || 0) : 0,
    heightGain: records.length > 1 ? 
      (Number(records[records.length - 1].height) || 0) - (Number(records[0].height) || 0) : 0,
  };

  // Son 6 kaydın verilerini hazırla
  const lastRecords = records.slice(-6);
  const defaultData = {
    labels: [''],
    datasets: [{ data: [0], color: (opacity = 1) => cardColor, strokeWidth: 2 }]
  };

  const chartData = lastRecords.length > 0 ? {
    labels: lastRecords.map(record => 
      format(new Date(record.date), 'dd MMM', { locale: tr })
    ),
    datasets: [
      {
        data: lastRecords.map(record => Number(record.weight) || 0),
        color: (opacity = 1) => cardColor,
        strokeWidth: 2,
      }
    ]
  } : defaultData;

  const heightChartData = lastRecords.length > 0 ? {
    labels: lastRecords.map(record => 
      format(new Date(record.date), 'dd MMM', { locale: tr })
    ),
    datasets: [
      {
        data: lastRecords.map(record => Number(record.height) || 0),
        color: (opacity = 1) => cardColor,
        strokeWidth: 2,
      }
    ]
  } : defaultData;

  const chartConfig = {
    backgroundColor: '#FFF',
    backgroundGradientFrom: '#FFF',
    backgroundGradientTo: '#FFF',
    decimalPlaces: 1,
    color: (opacity = 1) => cardColor,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#FFF"
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // Düz çizgiler
      strokeWidth: 1,
      stroke: "rgba(0,0,0,0.1)",
    },
    style: {
      borderRadius: 16,
    },
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: cardColor }]}>
        <View style={styles.headerContent}>
          <MaterialIcons name="child-care" size={24} color="#FFF" />
          <View>
            <ThemedText style={styles.headerTitle}>{formatName(baby.name)}</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Büyüme İstatistikleri</ThemedText>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCards}>
          <View style={[styles.summaryCard, { backgroundColor: '#FFF' }]}>
            <MaterialIcons name="fitness-center" size={24} color={cardColor} />
            <ThemedText style={[styles.summaryValue, { color: cardColor }]}>{stats.currentWeight} kg</ThemedText>
            <ThemedText style={styles.summaryLabel}>Mevcut Kilo</ThemedText>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#FFF' }]}>
            <MaterialIcons name="straighten" size={24} color={cardColor} />
            <ThemedText style={[styles.summaryValue, { color: cardColor }]}>{stats.currentHeight} cm</ThemedText>
            <ThemedText style={styles.summaryLabel}>Mevcut Boy</ThemedText>
          </View>
        </View>

        <View style={styles.summaryCards}>
          <View style={[styles.summaryCard, { backgroundColor: '#FFF' }]}>
            <MaterialIcons name="trending-up" size={24} color={cardColor} />
            <ThemedText style={[styles.summaryValue, { color: cardColor }]}>+{stats.weightGain.toFixed(1)} kg</ThemedText>
            <ThemedText style={styles.summaryLabel}>Kilo Artışı</ThemedText>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#FFF' }]}>
            <MaterialIcons name="trending-up" size={24} color={cardColor} />
            <ThemedText style={[styles.summaryValue, { color: cardColor }]}>+{stats.heightGain.toFixed(1)} cm</ThemedText>
            <ThemedText style={styles.summaryLabel}>Boy Artışı</ThemedText>
          </View>
        </View>

        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="fitness-center" size={24} color={cardColor} />
            <ThemedText style={styles.sectionTitle}>Kilo Takibi</ThemedText>
          </View>
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              withDots={true}
              withShadow
              withVerticalLines
              withHorizontalLines
              fromZero
              segments={5}
              style={[styles.chart, {
                marginVertical: 8,
                borderRadius: 16,
                padding: 8,
              }]}
            />
          </View>
        </View>

        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="straighten" size={24} color={cardColor} />
            <ThemedText style={styles.sectionTitle}>Boy Takibi</ThemedText>
          </View>
          <View style={styles.chartContainer}>
            <LineChart
              data={heightChartData}
              width={Dimensions.get('window').width - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              withDots={true}
              withShadow
              withVerticalLines
              withHorizontalLines
              fromZero
              segments={5}
              style={[styles.chart, {
                marginVertical: 8,
                borderRadius: 16,
                padding: 8,
              }]}
            />
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
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
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
    marginVertical: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
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
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default StatsScreen; 