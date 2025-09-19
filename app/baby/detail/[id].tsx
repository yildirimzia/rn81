import React from 'react';
import { View, StyleSheet, ScrollView, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBabyContext } from '@/context/BabyContext';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function BabyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { babies } = useBabyContext();
  const baby = babies.find(b => b.id === id);

  if (!baby) return null;

  const headerColor = baby.gender === 'female' ? '#FF8FAB' : '#60A5FA';
  const iconColor = baby.gender === 'female' ? '#F472B6' : '#3B82F6';

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years} yıl ${remainingMonths} ay`;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header with baby info */}
        <View style={[styles.header, { backgroundColor: headerColor }]}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => {}}
          >
            <MaterialIcons name="edit" size={20} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              {baby.photo?.url ? (
                <Image source={{ uri: baby.photo.url }} style={styles.babyPhoto} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <ThemedText style={styles.avatarText}>
                    {baby.name.charAt(0).toUpperCase()}
                  </ThemedText>
                </View>
              )}
            </View>
            
            <ThemedText style={styles.babyName}>{baby.name}</ThemedText>
            <ThemedText style={styles.babyAge}>
              {calculateAge(new Date(baby.birthDate))}
            </ThemedText>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Temel Bilgiler */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="assignment" size={20} color="#3B82F6" />
              <ThemedText style={styles.cardTitle}>Temel Bilgiler</ThemedText>
            </View>
            
            <InfoRow label="Doğum Tarihi" value={format(new Date(baby.birthDate), 'yyyy-MM-dd')} />
            <InfoRow label="Doğum Ağırlığı" value={`${baby.weight} kg`} />
            <InfoRow label="Doğum Boyu" value={`${baby.height} cm`} />
          </View>

          {/* Büyüme Takibi */}
          {baby.growth_tracking && baby.growth_tracking.length > 0 && (
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="trending-up" size={20} color="#10B981" />
                <ThemedText style={styles.cardTitle}>Son Büyüme Kaydı</ThemedText>
              </View>
              
              <InfoRow 
                label="Ağırlık" 
                value={`${baby.growth_tracking[baby.growth_tracking.length - 1].weight} kg`} 
              />
              <InfoRow 
                label="Boy" 
                value={`${baby.growth_tracking[baby.growth_tracking.length - 1].height} cm`} 
              />
            </View>
          )}

          {/* Aşı Bilgileri */}
          {baby.vaccine_information && baby.vaccine_information.length > 0 && (
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="local-hospital" size={20} color="#F59E0B" />
                <ThemedText style={styles.cardTitle}>Son Aşı Bilgileri</ThemedText>
              </View>
              
              <InfoRow 
                label="Aşı Adı" 
                value={baby.vaccine_information[baby.vaccine_information.length - 1].vaccine_name || 'Karma Aşı'} 
              />
            </View>
          )}

          {/* Alerji Bilgileri */}
          {baby.allergy_information && baby.allergy_information.length > 0 && (
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="warning" size={20} color="#EF4444" />
                <ThemedText style={styles.cardTitle}>Alerji Bilgileri</ThemedText>
              </View>
              
              {baby.allergy_information.map((allergy, index) => (
                <View key={index}>
                  <InfoRow 
                    label="Alerji Türü" 
                    value={allergy.allergy_name} 
                  />
                  <InfoRow 
                    label="Alerji Şiddeti" 
                    value={allergy.symptoms || 'Hafif'} 
                  />
                </View>
              ))}
            </View>
          )}

          {/* Diş Bilgileri */}
          {baby.teeth_information && baby.teeth_information.length > 0 && (
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="sentiment-satisfied" size={20} color="#8B5CF6" />
                <ThemedText style={styles.cardTitle}>Son Diş Bilgileri</ThemedText>
              </View>
              
              <InfoRow 
                label="Diş Türü" 
                value={baby.teeth_information[baby.teeth_information.length - 1].tooth_name || 'Alt Kesici'} 
              />
              <InfoRow 
                label="Çıkış Tarihi" 
                value={format(new Date(baby.teeth_information[baby.teeth_information.length - 1].date), 'yyyy-MM-dd')} 
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.infoRow}>
    <ThemedText style={styles.infoLabel}>{label}</ThemedText>
    <ThemedText style={styles.infoValue}>{value}</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  babyPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFF',
  },
  babyName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  babyAge: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'right',
  },
}); 