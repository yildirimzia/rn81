import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { authApi } from '@/services/api/auth';

export default function UserInfoScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    gender: user?.gender || 'not_specified',
  });

  const handleSubmit = async () => {
    try {
      const response = await authApi.updateUserInfo({
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
      });

      if (response.success) {
        updateUser({
          name: formData.name,
          gender: formData.gender,
        });
        router.back();
      } else {
        console.error('Failed to update user info');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => {
                router.back();
                console.log("going back");
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Bilgilerim</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Ad*</ThemedText>
              <TextInput 
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                placeholder="Ad"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>E-posta*</ThemedText>
              <TextInput 
                style={[styles.input, { backgroundColor: '#f5f5f5' }]}
                value={formData.email}
                editable={false}
                placeholder="E-posta"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.genderContainer}>
              <ThemedText style={styles.label}>Cinsiyet</ThemedText>
              <View style={styles.genderRowContainer}>
                <TouchableOpacity 
                  style={styles.genderOption}
                  onPress={() => setFormData({...formData, gender: 'female'})}
                >
                  <MaterialIcons 
                    name={formData.gender === 'female' ? 'radio-button-on' : 'radio-button-off'} 
                    size={24} 
                    color={formData.gender === 'female' ? Colors.light.tint : '#666'} 
                  />
                  <ThemedText style={styles.genderText}>Kadın</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.genderOption}
                  onPress={() => setFormData({...formData, gender: 'male'})}
                >
                  <MaterialIcons 
                    name={formData.gender === 'male' ? 'radio-button-on' : 'radio-button-off'} 
                    size={24} 
                    color={formData.gender === 'male' ? Colors.light.tint : '#666'} 
                  />
                  <ThemedText style={styles.genderText}>Erkek</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.genderOption}
                  onPress={() => setFormData({...formData, gender: 'not_specified'})}
                >
                  <MaterialIcons 
                    name={formData.gender === 'not_specified' ? 'radio-button-on' : 'radio-button-off'} 
                    size={24} 
                    color={formData.gender === 'not_specified' ? Colors.light.tint : '#666'} 
                  />
                  <ThemedText style={styles.genderText}>Belirtmek istemiyorum</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
        >
          <ThemedText style={styles.buttonText}>GÖNDER</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    padding: 16,
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  genderContainer: {
    marginVertical: 10,
  },
  genderRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
    gap: 24,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginHorizontal: 2,
  },
  genderText: {
    fontSize: 13,
    color: '#333',
    flexShrink: 1,
  },
  submitButton: {
    backgroundColor: Colors.light.tint,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 