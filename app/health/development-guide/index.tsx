import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#6B73FF', '#8E5CFF', '#A855F7']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <MaterialIcons name="menu-book" size={32} color="#FFF" />
            </View>
            <View style={styles.headerText}>
              <ThemedText style={styles.headerSubtitle}>
                Aylık gelişim bilgileri ve ipuçları
              </ThemedText>
            </View>
          </View>
        </LinearGradient>

        {/* Month Selector */}
        <View style={styles.monthSelectorContainer}>
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
                  selectedMonth === month.number && styles.selectedMonthButton
                ]}
                onPress={() => setSelectedMonth(month.number)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={selectedMonth === month.number 
                    ? ['#6B73FF', '#8E5CFF'] 
                    : ['#F8FAFC', '#F1F5F9']
                  }
                  style={styles.monthGradient}
                >
                  <ThemedText style={[
                    styles.monthNumber,
                    selectedMonth === month.number && styles.selectedMonthNumber
                  ]}>
                    {month.label}
                  </ThemedText>
                  <ThemedText style={[
                    styles.monthLabel,
                    selectedMonth === month.number && styles.selectedMonthLabel
                  ]}>
                    Ay
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {monthInfo && (
            <>
              {/* Month Info Card */}
              <View style={styles.monthInfoCard}>
                <View style={styles.monthInfoHeader}>
                  <LinearGradient
                    colors={['#6B73FF', '#8E5CFF']}
                    style={styles.monthInfoIcon}
                  >
                    <MaterialIcons name="child-care" size={24} color="#FFF" />
                  </LinearGradient>
                  <View style={styles.monthInfoText}>
                    <ThemedText style={styles.monthTitle}>{monthInfo.title}</ThemedText>
                    <ThemedText style={styles.monthDescription}>{monthInfo.description}</ThemedText>
                  </View>
                </View>
              </View>

              {/* Measurements Card */}
              <View style={styles.measurementsCard}>
                <View style={styles.cardHeader}>
                  <MaterialIcons name="straighten" size={20} color="#6B73FF" />
                  <ThemedText style={styles.cardHeaderTitle}>Ortalama Ölçüler</ThemedText>
                </View>
                <View style={styles.measurementsGrid}>
                  <View style={styles.measurementBox}>
                    <View style={styles.measurementIcon}>
                      <MaterialIcons name="height" size={24} color="#6B73FF" />
                    </View>
                    <View style={styles.measurementInfo}>
                      <ThemedText style={styles.measurementLabel}>Boy</ThemedText>
                      <ThemedText style={styles.measurementValue}>
                        {monthInfo.measurements.height}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.measurementBox}>
                    <View style={styles.measurementIcon}>
                      <MaterialIcons name="monitor-weight" size={24} color="#6B73FF" />
                    </View>
                    <View style={styles.measurementInfo}>
                      <ThemedText style={styles.measurementLabel}>Ağırlık</ThemedText>
                      <ThemedText style={styles.measurementValue}>
                        {monthInfo.measurements.weight}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>

              {/* Development Sections */}
              <View style={styles.sectionsContainer}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="timeline" size={20} color="#6B73FF" />
                  <ThemedText style={styles.sectionHeaderTitle}>Gelişim Alanları</ThemedText>
                </View>
                {monthInfo.sections.map((section, index) => (
                  <View key={index} style={styles.sectionCard}>
                    <View style={styles.sectionTitleContainer}>
                      <View style={[styles.sectionIconContainer, { backgroundColor: getSectionColor(section.title) }]}>
                        <MaterialIcons 
                          name={getSectionIcon(section.title)} 
                          size={20} 
                          color="#FFF"
                        />
                      </View>
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
    </SafeAreaView>
  );
};

const getSectionColor = (title: string): string => {
  const colors: { [key: string]: string } = {
    'Fiziksel Gelişim': '#10B981',
    'Motor Gelişim': '#3B82F6',
    'Sosyal Gelişim': '#F59E0B',
    'Beslenme': '#EF4444',
    'İletişim': '#8B5CF6',
    'Görme ve İşitme': '#06B6D4',
    'Dil Gelişimi': '#EC4899',
    'Bilişsel Gelişim': '#84CC16',
    'Hareket': '#F97316',
  };
  return colors[title] || '#6B73FF';
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
  safeArea: {
    flex: 1,
    backgroundColor: '#6B73FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '400',
  },
  monthSelectorContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  monthSelector: {
    maxHeight: 80,
  },
  monthSelectorContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  monthButton: {
    marginHorizontal: 4,
  },
  selectedMonthButton: {
    transform: [{ scale: 1.05 }],
  },
  monthGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  selectedMonthNumber: {
    color: '#FFF',
  },
  monthLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '500',
  },
  selectedMonthLabel: {
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
  },
  monthInfoCard: {
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  monthInfoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  monthInfoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthInfoText: {
    flex: 1,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  monthDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  measurementsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  measurementsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  measurementBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  measurementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(107, 115, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  measurementInfo: {
    flex: 1,
  },
  measurementLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  measurementValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
});

export default DevelopmentGuideScreen; 