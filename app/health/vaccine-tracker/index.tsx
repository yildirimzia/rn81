import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Vaccine {
  id: string;
  name: string;
  date: Date;
  note?: string;
}

export default function VaccineTrackerScreen() {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);

  useEffect(() => {
    // Burada API'den aşıları çekebilirsiniz
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        {vaccines.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="vaccines" size={48} color="#999" />
            <ThemedText style={styles.emptyText}>Henüz aşı kaydı bulunmuyor</ThemedText>
          </View>
        ) : (
          vaccines.map(vaccine => (
            <View key={vaccine.id} style={styles.vaccineCard}>
              <View style={styles.vaccineHeader}>
                <ThemedText style={styles.vaccineName}>{vaccine.name}</ThemedText>
                <ThemedText style={styles.vaccineDate}>
                  {format(new Date(vaccine.date), 'd MMM yyyy', { locale: tr })}
                </ThemedText>
              </View>
              {vaccine.note && (
                <ThemedText style={styles.vaccineNote}>{vaccine.note}</ThemedText>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/health/vaccine-tracker/add')}
      >
        <MaterialIcons name="add" size={24} color="#fff" />
        <ThemedText style={styles.addButtonText}>Aşı Ekle</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  vaccineCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  vaccineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: '500',
  },
  vaccineDate: {
    fontSize: 14,
    color: '#666',
  },
  vaccineNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: Colors.light.tint,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 