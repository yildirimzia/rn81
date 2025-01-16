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
  photo?: string;
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
        const mappedBabies = response.data.babies.map((baby) => ({
          id: baby._id,
          name: baby.name,
          birthDate: new Date(baby.birthDate),
          gender: baby.gender,
          weight: baby.weight,
          height: baby.height,
          photo: baby.photo
        }));
        
        setBabies(mappedBabies);
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
