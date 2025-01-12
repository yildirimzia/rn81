import { View, StyleSheet, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HistoryScreen() {
  const historyData = [
    {
      id: '1',
      date: '2024-03-10',
      action: 'Yeni Sipariş',
      details: 'Sipariş #1234 alındı',
      time: '14:30',
    },
    {
      id: '2',
      date: '2024-03-10',
      action: 'Ödeme',
      details: '₺150 ödeme alındı',
      time: '14:35',
    },
    {
      id: '3',
      date: '2024-03-09',
      action: 'Stok Güncelleme',
      details: 'Kahve stoku güncellendi',
      time: '16:20',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <View style={styles.timeContainer}>
              <ThemedText style={styles.time}>{item.time}</ThemedText>
              <ThemedText style={styles.date}>{item.date}</ThemedText>
            </View>
            <View style={styles.contentContainer}>
              <ThemedText style={styles.action}>{item.action}</ThemedText>
              <ThemedText style={styles.details}>{item.details}</ThemedText>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  historyItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  timeContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
  },
  action: {
    fontSize: 16,
    fontWeight: '600',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  separator: {
    height: 12,
  },
}); 