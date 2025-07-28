import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call - in production, this would be a real API endpoint
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on email
      let mockUser: User;
      if (email.includes('admin')) {
        mockUser = {
          id: '1',
          email,
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          panNumber: 'ABCDE1234F',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      } else if (email.includes('accountant')) {
        mockUser = {
          id: '2',
          email,
          firstName: 'Rajesh',
          lastName: 'Sharma',
          role: 'accountant',
          panNumber: 'FGHIJ5678K',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      } else {
        mockUser = {
          id: '3',
          email,
          firstName: 'Priya',
          lastName: 'Patel',
          role: 'user',
          panNumber: 'KLMNO9012P',
          aadharNumber: '1234-5678-9012',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      }

      const mockToken = 'mock-jwt-token-' + Date.now();
      
      setUser(mockUser);
      setToken(mockToken);
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};