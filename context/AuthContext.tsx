import { createContext, useContext, useState, useEffect } from 'react';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: { user: User }) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Debug için state değişimlerini izleyelim
  useEffect(() => {
    console.log('AuthContext - isAuthenticated değişti:', isAuthenticated);
    console.log('AuthContext - user değişti:', user);
  }, [isAuthenticated, user]);

  const signIn = (data: { user: User }) => {
    console.log('SignIn fonksiyonu çağrıldı, gelen data:', data);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const signOut = () => {
    console.log('SignOut fonksiyonu çağrıldı');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    signIn,
    signOut
  };

  console.log('AuthProvider render - current state:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 