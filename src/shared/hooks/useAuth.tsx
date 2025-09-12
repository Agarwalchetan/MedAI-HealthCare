import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Doctor } from '../types';
import { userAPI } from '../../modules/user/services/userAPI';
import { labAPI } from '../../modules/lab/services/labAPI';

interface AuthContextType {
  user: User | null;
  doctor: Doctor | null;
  lab: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setDoctorAuth: (doctor: Doctor, token: string) => void;
  setLabAuth: (lab: any, token: string) => void;
  isAuthenticated: boolean;
  userType: 'user' | 'doctor' | 'lab' | null;
}

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
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [lab, setLab] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user, doctor, or lab is logged in on app start
    const checkAuth = async () => {
      console.log('Auth check starting...');
      try {
        const token = localStorage.getItem('token');
        console.log('Token found:', !!token);
        
        if (token) {
          // Check for user first
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              console.log('Setting user from localStorage:', parsedUser);
              setUser(parsedUser);
            } catch (e) {
              console.error('Error parsing stored user:', e);
            }
          }
          
          // Check for doctor
          const storedDoctor = localStorage.getItem('doctor');
          if (storedDoctor) {
            try {
              const parsedDoctor = JSON.parse(storedDoctor);
              console.log('Setting doctor from localStorage:', parsedDoctor);
              setDoctor(parsedDoctor);
            } catch (e) {
              console.error('Error parsing stored doctor:', e);
            }
          }
          
          // Check for lab
          const storedLab = localStorage.getItem('lab');
          if (storedLab) {
            try {
              const parsedLab = JSON.parse(storedLab);
              console.log('Setting lab from localStorage:', parsedLab);
              setLab(parsedLab);
            } catch (e) {
              console.error('Error parsing stored lab:', e);
            }
          }
          
          // Only try to fetch user profile if we have a token but no stored user data
          // Don't fetch if we already have doctor or lab data
          if (!storedUser && !storedDoctor && !storedLab) {
            try {
              const response = await userAPI.getProfile();
              if (response.data?.user) {
                setUser(response.data.user);
              }
            } catch (error: any) {
              console.error('User profile fetch failed:', error);
              // Don't clear auth data here - could be doctor/lab token or network issue
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Don't clear auth data in the outer catch - this could be a network error
      } finally {
        console.log('Auth check completed, setting loading to false');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await userAPI.login(email, password);
      const { user, token } = response.data || {};
      if (user && token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      // If backend is not available, create a mock user for development
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        console.warn('Backend not available, using mock authentication');
        const mockUser: User = {
          _id: 'mock-user-id',
          fullName: 'Demo User',
          email: email,
          role: 'patient',
          age: 30,
          gender: 'male',
          phone: '+1234567890',
          address: {
            street: '123 Demo St',
            city: 'Demo City',
            state: 'Demo State',
            zipCode: '12345',
            country: 'Demo Country'
          },
          emergencyContact: {
            name: 'Emergency Contact',
            phone: '+1234567890',
            relationship: 'Family'
          },
          medicalHistory: [],
          prescriptions: [],
          labReports: [],
          insurance: {
            provider: 'Demo Insurance',
            policyNumber: 'DEMO123',
            groupNumber: 'GRP123',
            validUntil: new Date('2025-12-31'),
            coverageAmount: 100000,
            deductible: 1000,
            isActive: true
          },
          isEmailVerified: true,
          isPhoneVerified: true,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const mockToken = 'mock-jwt-token';
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return;
      }
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await userAPI.register(userData);
      const { user, token } = response.data || {};
      
      if (user && token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('doctor');
    localStorage.removeItem('lab');
    setUser(null);
    setDoctor(null);
    setLab(null);
    userAPI.logout().catch(console.error);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const setDoctorAuth = (doctorData: Doctor, token: string) => {
    console.log('setDoctorAuth called with:', doctorData, token);
    localStorage.setItem('token', token);
    localStorage.setItem('doctor', JSON.stringify(doctorData));
    setDoctor(doctorData);
    console.log('Doctor state updated in auth context');
  };

  const setLabAuth = (labData: any, token: string) => {
    console.log('setLabAuth called with:', labData, token);
    localStorage.setItem('token', token);
    localStorage.setItem('lab', JSON.stringify(labData));
    setLab(labData);
    console.log('Lab state updated in auth context');
  };

  const isAuthenticated = !!(user || doctor || lab);
  const userType: 'user' | 'doctor' | 'lab' | null = user ? 'user' : doctor ? 'doctor' : lab ? 'lab' : null;

  const value = {
    user,
    doctor,
    lab,
    loading,
    login,
    register,
    logout,
    updateUser,
    setDoctorAuth,
    setLabAuth,
    isAuthenticated,
    userType,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
