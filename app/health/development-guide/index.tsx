import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

interface MonthInfo {
  title: string;
  description: string;
  measurements: {
    height: string;
    weight: string;
  };
  sections: {
    title: string;
    content: string;
  }[];
}

const months = Array.from({ length: 12 }, (_, i) => ({
  number: i + 1,
  label: `${i + 1}`,
}));

const monthlyInfo: { [key: number]: MonthInfo } = {
  1: {
    title: "1'inci ayda bebeğiniz",
    description: "Bebeğiniz dünyaya geldi ve yeni çevresine alışmaya çalışıyor. Bu ay temel refleksler ve duyusal gelişim ön planda.",
    measurements: {
      height: "45,7 — 55,5 cm",
      weight: "2,31 — 4,81 kg"
    },
    sections: [
      {
        title: "Fiziksel Gelişim",
        content: "Başını kısa süreli tutabilir, yüzüstü pozisyonda başını kaldırabilir. Ellerini yumruk şeklinde tutar."
      },
      {
        title: "Görme ve İşitme",
        content: "30-50 cm mesafedeki nesneleri görebilir. Ani seslere tepki verir. Yüzleri tanımaya başlar."
      },
      {
        title: "Beslenme",
        content: "Sadece anne sütü veya formül mama ile beslenir. 2-3 saatte bir acıkır."
      }
    ]
  },
  2: {
    title: "2'nci ayda bebeğiniz",
    description: "Bebeğiniz artık çevresini daha fazla keşfetmeye başlıyor ve ilk sosyal gülümsemeleini gösteriyor.",
    measurements: {
      height: "51 — 61 cm",
      weight: "3,5 — 6,0 kg"
    },
    sections: [
      {
        title: "Sosyal Gelişim",
        content: "Sosyal gülümseme başlar. Tanıdık yüzlere tepki verir. Agulama sesleri çıkarır."
      },
      {
        title: "Motor Gelişim",
        content: "Başını daha uzun süre dik tutabilir. Nesneleri takip edebilir. Ellerini daha kontrollü hareket ettirir."
      }
    ]
  },
  3: {
    title: "3'üncü ayda bebeğiniz",
    description: "Bebeğiniz artık daha aktif ve meraklı. Çevresiyle daha fazla etkileşime giriyor.",
    measurements: {
      height: "55 — 64 cm",
      weight: "4,5 — 7,0 kg"
    },
    sections: [
      {
        title: "İletişim",
        content: "Kahkaha atmaya başlar. Farklı sesler çıkarır. Müziğe tepki verir."
      },
      {
        title: "Fiziksel Gelişim",
        content: "Destekle oturabilir. Nesneleri kavrayabilir. Yüzüstü pozisyonda göğsünü kaldırabilir."
      }
    ]
  },
  4: {
    title: "4'üncü ayda bebeğiniz",
    description: "Bebeğiniz artık daha bağımsız hareketler yapabiliyor ve çevresiyle daha fazla etkileşime giriyor.",
    measurements: {
      height: "58 — 67 cm",
      weight: "5,5 — 8,0 kg"
    },
    sections: [
      {
        title: "Motor Beceriler",
        content: "Nesneleri bir elden diğerine geçirebilir. Desteksiz oturmaya başlar. Yuvarlanabilir."
      },
      {
        title: "Beslenme",
        content: "Ek gıdaya hazırlık dönemi. Katı gıdalara ilgi göstermeye başlar."
      }
    ]
  },
  5: {
    title: "5'inci ayda bebeğiniz",
    description: "Bebeğiniz artık daha hareketli ve meraklı. Çevresini keşfetmeye can atıyor.",
    measurements: {
      height: "60 — 69 cm",
      weight: "6,0 — 8,5 kg"
    },
    sections: [
      {
        title: "Sosyal Gelişim",
        content: "Aynada kendini tanır. Yabancı kaygısı başlayabilir. İsmiyle çağrıldığında tepki verir."
      },
      {
        title: "Motor Gelişim",
        content: "Destekle ayakta durabilir. Nesneleri ağzına götürür. Emeklemeye hazırlanır."
      }
    ]
  },
  6: {
    title: "6'ncı ayda bebeğiniz",
    description: "Önemli bir dönüm noktası: Ek gıdaya geçiş ve oturma becerisi.",
    measurements: {
      height: "62 — 71 cm",
      weight: "6,5 — 9,0 kg"
    },
    sections: [
      {
        title: "Beslenme",
        content: "Ek gıdaya geçiş başlar. Püre kıvamında besinler verilebilir."
      },
      {
        title: "Fiziksel Gelişim",
        content: "Desteksiz oturabilir. Nesneleri bilinçli bırakabilir. Emeklemeye hazır."
      }
    ]
  },
  7: {
    title: "7'nci ayda bebeğiniz",
    description: "Hareket kabiliyeti artıyor ve iletişim becerileri gelişiyor.",
    measurements: {
      height: "64 — 73 cm",
      weight: "7,0 — 9,5 kg"
    },
    sections: [
      {
        title: "Hareket",
        content: "Emeklemeye başlayabilir. Tutunarak ayağa kalkabilir."
      },
      {
        title: "İletişim",
        content: "Hece tekrarları yapar. Jest ve mimikleri anlar. Bay bay yapabilir."
      }
    ]
  },
  8: {
    title: "8'inci ayda bebeğiniz",
    description: "Bağımsız hareket ve keşif dönemi başlıyor.",
    measurements: {
      height: "66 — 75 cm",
      weight: "7,5 — 10,0 kg"
    },
    sections: [
      {
        title: "Motor Gelişim",
        content: "Mobilya desteğiyle yürüyebilir. Parmak ucuyla nesneleri alabilir."
      },
      {
        title: "Sosyal Gelişim",
        content: "Basit oyunlar oynayabilir. Saklambaç oyununu sever."
      }
    ]
  },
  9: {
    title: "9'uncu ayda bebeğiniz",
    description: "İlk kelimeler ve bağımsız hareketler dönemi.",
    measurements: {
      height: "68 — 77 cm",
      weight: "8,0 — 10,5 kg"
    },
    sections: [
      {
        title: "Dil Gelişimi",
        content: "İlk kelimelerini söyleyebilir (anne, baba gibi). Basit komutları anlar."
      },
      {
        title: "Fiziksel Gelişim",
        content: "Destekle ayakta durabilir. Parmak ucunda yürüyebilir."
      }
    ]
  },
  10: {
    title: "10'uncu ayda bebeğiniz",
    description: "İlk adımlar ve artan iletişim becerileri.",
    measurements: {
      height: "70 — 79 cm",
      weight: "8,5 — 11,0 kg"
    },
    sections: [
      {
        title: "Motor Beceriler",
        content: "İlk adımlarını atabilir. Tek başına ayakta durabilir."
      },
      {
        title: "Bilişsel Gelişim",
        content: "Neden-sonuç ilişkisini anlamaya başlar. Basit problemleri çözebilir."
      }
    ]
  },
  11: {
    title: "11'inci ayda bebeğiniz",
    description: "Bağımsız hareket ve iletişim becerileri gelişiyor.",
    measurements: {
      height: "71 — 80 cm",
      weight: "8,7 — 11,5 kg"
    },
    sections: [
      {
        title: "Hareket",
        content: "Daha güvenli yürür. Eşyaların üzerine tırmanabilir."
      },
      {
        title: "İletişim",
        content: "2-3 kelime kullanabilir. İsteklerini jest ve mimiklerle belirtir."
      }
    ]
  },
  12: {
    title: "12'nci ayda bebeğiniz",
    description: "İlk yaşını dolduran bebeğiniz artık küçük bir çocuk!",
    measurements: {
      height: "72 — 82 cm",
      weight: "9,0 — 12,0 kg"
    },
    sections: [
      {
        title: "Sosyal Gelişim",
        content: "Basit oyunlar oynayabilir. Taklit becerileri gelişmiştir."
      },
      {
        title: "Motor Gelişim",
        content: "Bağımsız yürür. Merdiven çıkabilir. Karalama yapabilir."
      },
      {
        title: "Beslenme",
        content: "Aile yemeklerine katılabilir. Kaşık kullanmaya başlar."
      }
    ]
  }
};

const DevelopmentGuideScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState(1);

  const monthInfo = monthlyInfo[selectedMonth];

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        horizontal 
        style={styles.monthSelector}
        contentContainerStyle={styles.monthSelectorContent}
        showsHorizontalScrollIndicator={false}
      >
        {months.map((month) => (
          <TouchableOpacity
            key={month.number}
            style={[
              styles.monthButton,
              selectedMonth === month.number && styles.selectedMonth
            ]}
            onPress={() => setSelectedMonth(month.number)}
          >
            <View style={styles.monthCircle}>
              <ThemedText style={[
                styles.monthText,
                selectedMonth === month.number && styles.selectedMonthText
              ]}>
                {month.label}
              </ThemedText>
              <ThemedText style={[
                styles.monthLabel,
                selectedMonth === month.number && styles.selectedMonthLabel
              ]}>
                Ay
              </ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {monthInfo && (
          <>
            <View style={styles.headerSection}>
              <View style={styles.iconContainer}>
                <MaterialIcons 
                  name="child-care" 
                  size={32} 
                  color="#FFF"
                />
              </View>
              <View style={styles.headerInfo}>
                <ThemedText style={styles.title}>{monthInfo.title}</ThemedText>
                <ThemedText style={styles.description}>{monthInfo.description}</ThemedText>
              </View>
            </View>

            <View style={styles.measurementsCard}>
              <View style={styles.measurementItem}>
                <MaterialIcons name="straighten" size={24} color={Colors.light.tint} />
                <View style={styles.measurementInfo}>
                  <ThemedText style={styles.measurementTitle}>Boy</ThemedText>
                  <ThemedText style={styles.measurementValue}>
                    {monthInfo.measurements.height}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.measurementDivider} />
              <View style={styles.measurementItem}>
                <MaterialIcons name="monitor-weight" size={24} color={Colors.light.tint} />
                <View style={styles.measurementInfo}>
                  <ThemedText style={styles.measurementTitle}>Ağırlık</ThemedText>
                  <ThemedText style={styles.measurementValue}>
                    {monthInfo.measurements.weight}
                  </ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.sectionsContainer}>
              {monthInfo.sections.map((section, index) => (
                <View key={index} style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <MaterialIcons 
                      name={getSectionIcon(section.title)} 
                      size={24} 
                      color={Colors.light.tint}
                    />
                    <ThemedText style={styles.sectionTitle}>
                      {section.title}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.sectionContent}>
                    {section.content}
                  </ThemedText>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
};

const getSectionIcon = (title: string): keyof typeof MaterialIcons.glyphMap => {
  const icons: { [key: string]: keyof typeof MaterialIcons.glyphMap } = {
    'Fiziksel Gelişim': 'fitness-center',
    'Motor Gelişim': 'directions-run',
    'Sosyal Gelişim': 'people',
    'Beslenme': 'restaurant',
    'İletişim': 'chat',
    'Görme ve İşitme': 'visibility',
    'Dil Gelişimi': 'record-voice-over',
    'Bilişsel Gelişim': 'psychology',
    'Hareket': 'directions-walk',
  };
  return icons[title] || 'info';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  monthSelector: {
    maxHeight: 100,
    backgroundColor: '#FFF',
  },
  monthSelectorContent: {
    padding: 16,
  },
  monthButton: {
    marginHorizontal: 6,
  },
  monthCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMonth: {
    transform: [{scale: 1.1}],
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  selectedMonthText: {
    color: Colors.light.tint,
  },
  monthLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  selectedMonthLabel: {
    color: Colors.light.tint,
  },
  content: {
    flex: 1,
  },
  headerSection: {
    backgroundColor: Colors.light.tint,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  measurementsCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  measurementItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  measurementInfo: {
    marginLeft: 12,
  },
  measurementDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  measurementTitle: {
    fontSize: 12,
    color: '#666',
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.tint,
  },
  sectionsContainer: {
    padding: 16,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
  },
});

export default DevelopmentGuideScreen; 