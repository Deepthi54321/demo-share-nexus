
import { BASE_URL } from './apiConfig';

export interface SettingsProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  company: string;
  bio: string;
}

export const settingsApi = {
  // Fetch all settings profiles
  getProfiles: async (): Promise<SettingsProfile[]> => {
    const response = await fetch(`${BASE_URL}/api/settings-profiles`);
    if (!response.ok) {
      throw new Error('Failed to fetch settings profiles');
    }
    return response.json();
  },

  // Create new settings profile
  createProfile: async (profile: Omit<SettingsProfile, 'id'>): Promise<SettingsProfile> => {
    const response = await fetch(`${BASE_URL}/api/settings-profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error('Failed to create settings profile');
    }
    return response.json();
  },

  // Update settings profile by ID
  updateProfile: async (id: string, profile: Partial<SettingsProfile>): Promise<SettingsProfile> => {
    const response = await fetch(`${BASE_URL}/api/settings-profiles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error('Failed to update settings profile');
    }
    return response.json();
  },

  // Delete settings profile by ID
  deleteProfile: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/settings-profiles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete settings profile');
    }
  },
};
