import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import { useBabyContext } from '@/context/BabyContext';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function BabyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { babies } = useBabyContext();
  const baby = babies.find(b => b.id === id);

  if (!baby) return null;

  const cardColor = baby.gender === 'female' ? '#FF69B4' : '#4A90E2';

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
    return `${Math.floor(months / 12)} yıl ${months % 12} ay`;
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: cardColor }]}>
        <View style={styles.headerContent}>
          {baby.photo?.url ? (
            <Image source={{ uri: baby.photo.url }} style={styles.babyPhoto} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <MaterialIcons name="child-care" size={48} color="#FFF" />
            </View>
          )}
          <ThemedText style={styles.headerTitle}>{baby.name}</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            {calculateAge(new Date(baby.birthDate))}
          </ThemedText>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Temel Bilgiler */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="info" size={24} color={cardColor} />
            <ThemedText style={styles.sectionTitle}>Temel Bilgiler</ThemedText>
          </View>
          <View style={styles.infoCard}>
            <InfoRow icon="cake" label="Doğum Tarihi" value={format(new Date(baby.birthDate), 'dd MMMM yyyy', { locale: tr })} />
            <InfoRow icon="wc" label="Cinsiyet" value={baby.gender === 'female' ? 'Kız' : 'Erkek'} />
            <InfoRow icon="monitor-weight" label="Doğum Kilosu" value={`${baby.weight} kg`} />
            <InfoRow icon="straighten" label="Doğum Boyu" value={`${baby.height} cm`} />
          </View>
        </View>

        {/* Büyüme Takibi */}
        {baby.growth_tracking && baby.growth_tracking.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="trending-up" size={24} color={cardColor} />
              <ThemedText style={styles.sectionTitle}>Son Büyüme Kaydı</ThemedText>
            </View>
            <View style={styles.infoCard}>
              <InfoRow 
                icon="monitor-weight" 
                label="Güncel Kilo" 
                value={`${baby.growth_tracking[baby.growth_tracking.length - 1].weight} kg`} 
              />
              <InfoRow 
                icon="straighten" 
                label="Güncel Boy" 
                value={`${baby.growth_tracking[baby.growth_tracking.length - 1].height} cm`} 
              />
            </View>
          </View>
        )}

        {/* Aşı Bilgileri */}
        {baby.vaccine_information && baby.vaccine_information.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="healing" size={24} color={cardColor} />
              <ThemedText style={styles.sectionTitle}>Son Aşı Bilgileri</ThemedText>
            </View>
            <View style={styles.infoCard}>
              {baby.vaccine_information.slice(-3).map((vaccine, index) => (
                <InfoRow 
                  key={index}
                  icon="event" 
                  label={vaccine.vaccine_name}
                  value={format(new Date(vaccine.vaccine_date), 'dd MMM yyyy', { locale: tr })}
                />
              ))}
            </View>
          </View>
        )}

        {/* Alerji Bilgileri */}
        {baby.allergy_information && baby.allergy_information.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="warning" size={24} color={cardColor} />
              <ThemedText style={styles.sectionTitle}>Alerji Bilgileri</ThemedText>
            </View>
            <View style={styles.infoCard}>
              {baby.allergy_information.map((allergy, index) => (
                <InfoRow 
                  key={index}
                  icon="error-outline" 
                  label={allergy.allergy_name}
                  value={allergy.symptoms || 'Belirti belirtilmemiş'}
                />
              ))}
            </View>
          </View>
        )}

        {/* Diş Bilgileri */}
        {baby.teeth_information && baby.teeth_information.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="face" size={24} color={cardColor} />
              <ThemedText style={styles.sectionTitle}>Son Diş Bilgileri</ThemedText>
            </View>
            <View style={styles.infoCard}>
              {baby.teeth_information.slice(-3).map((tooth, index) => (
                <InfoRow 
                  key={index}
                  icon="event" 
                  label={tooth.tooth_name}
                  value={format(new Date(tooth.date), 'dd MMM yyyy', { locale: tr })}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const InfoRow = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <View style={styles.infoRow}>
    <MaterialIcons name={icon} size={20} color="#666" />
    <ThemedText style={styles.infoLabel}>{label}</ThemedText>
    <ThemedText style={styles.infoValue}>{value}</ThemedText>
  </View>
);

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
    alignItems: 'center',
    paddingTop: 48,
  },
  babyPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    flex: 1,
    marginLeft: 8,
    color: '#666',
  },
  infoValue: {
    fontWeight: '500',
  },
}); 