import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function BabyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return (
    <View>
      {/* Detay sayfası içeriği */}
    </View>
  );
} 