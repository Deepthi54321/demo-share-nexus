import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { settingsApi, SettingsProfile } from '../services/settingsApi';

interface AdminProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  company: string;
  bio: string;
}

interface AdminContextType {
  adminProfile: AdminProfile;
  updateAdminProfile: (updates: Partial<AdminProfile>) => Promise<void>;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'John Admin',
    email: 'admin@demo.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    company: 'Demo Corp',
    bio: 'Experienced admin managing demo sessions and user operations.'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        const profiles = await settingsApi.getProfiles();
        // Use the first profile if available, otherwise keep default
        if (profiles.length > 0) {
          setAdminProfile(profiles[0]);
        }
      } catch (error) {
        console.error('Failed to load profile data:', error);
        // Keep using default profile data if API fails
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const updateAdminProfile = async (updates: Partial<AdminProfile>) => {
    try {
      setIsLoading(true);
      const updatedProfile = { ...adminProfile, ...updates };
      
      if (adminProfile.id) {
        // Update existing profile
        const result = await settingsApi.updateProfile(adminProfile.id, updatedProfile);
        setAdminProfile(result);
      } else {
        // Create new profile
        const result = await settingsApi.createProfile(updatedProfile);
        setAdminProfile(result);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminContext.Provider value={{ adminProfile, updateAdminProfile, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
};
