import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function GenderSelectScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Bebeğinizin Cinsiyetini Seçin</ThemedText>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.genderButton, styles.girlButton]}
            onPress={() => router.push('/baby/female/add')}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 182, 193, 0.1)' }]}>
              <MaterialIcons name="child-care" size={48} color="#FF69B4" />
            </View>
            <ThemedText style={styles.buttonText}>Kız Bebek</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.genderButton, styles.boyButton]}
            onPress={() => router.push('/baby/male/add')}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(135, 206, 235, 0.1)' }]}>
              <MaterialIcons name="child-care" size={48} color="#4A90E2" />
            </View>
            <ThemedText style={styles.buttonText}>Erkek Bebek</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonsContainer: {
    gap: 20,
  },
  genderButton: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  girlButton: {
    backgroundColor: 'rgba(255, 182, 193, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 182, 193, 0.3)',
  },
  boyButton: {
    backgroundColor: 'rgba(135, 206, 235, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(135, 206, 235, 0.3)',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
  },
}); 