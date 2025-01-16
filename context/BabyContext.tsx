import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { babyApi } from '@/services/api/baby';
import { IBabyData } from '@/services/api/baby';

interface Baby {
  id: string;
  name: string;
  birthDate: Date;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  photo?: { url: string };
  vaccine_information?: {
    vaccine_name: string;
    vaccine_date: Date;
    vaccine_notes?: string;
  }[];
}

interface BabyContextType {
  babies: Baby[];
  setBabies: (babies: Baby[]) => void;
  selectedBaby: Baby | null;
  setSelectedBaby: (baby: Baby | null) => void;
  fetchBabies: () => Promise<void>;
  loading: boolean;
}

const BabyContext = createContext<BabyContextType>({
  babies: [],
  setBabies: () => {},
  selectedBaby: null,
  setSelectedBaby: () => {},
  fetchBabies: async () => {},
  loading: false,
});

export function BabyProvider({ children }: { children: ReactNode }) {
  const [babies, setBabies] = useState<Baby[]>([]);
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBabies = async () => {
    try {
      setLoading(true);
      const response = await babyApi.getBabies();

      if (response.data?.success) {
        const mappedBabies = response.data.babies.map((baby: any) => {
          return {
            id: baby._id,
            name: baby.name,
            birthDate: new Date(baby.birthDate),
            gender: baby.gender,
            weight: baby.weight,
            height: baby.height,
            photo: baby.photo,
            vaccine_information: baby.vaccine_information || []
          };
        });

        setBabies(mappedBabies);

        // Aşı bilgisi olan bebeği seçelim
        const babyWithVaccines = mappedBabies.find(baby => 
          baby.vaccine_information && baby.vaccine_information.length > 0
        );

        if (babyWithVaccines) {
          console.log('Setting baby with vaccines:', babyWithVaccines);
          setSelectedBaby(babyWithVaccines);
        } else if (mappedBabies.length > 0) {
          console.log('No baby with vaccines found, setting first baby');
          setSelectedBaby(mappedBabies[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching babies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBabies();
  }, []);

  return (
    <BabyContext.Provider value={{ 
      babies, 
      setBabies, 
      selectedBaby, 
      setSelectedBaby,
      fetchBabies,
      loading 
    }}>
      {children}
    </BabyContext.Provider>
  );
}

export const useBabyContext = () => useContext(BabyContext);
