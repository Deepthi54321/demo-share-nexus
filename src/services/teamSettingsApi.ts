
import { BASE_URL } from './apiConfig';

export interface TeamSettings {
  id?: string;
  maxSessionsPerDay: string;
  autoApproveRegistrations: boolean;
  requireManagerApproval: boolean;
  sessionReminderHours: string;
}

export const teamSettingsApi = {
  // Fetch all team settings
  getSettings: async (): Promise<TeamSettings[]> => {
    const response = await fetch(`${BASE_URL}/api/settings-team`);
    if (!response.ok) {
      throw new Error('Failed to fetch team settings');
    }
    return response.json();
  },

  // Create new team settings
  createSettings: async (settings: Omit<TeamSettings, 'id'>): Promise<TeamSettings> => {
    const response = await fetch(`${BASE_URL}/api/settings-team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to create team settings');
    }
    return response.json();
  },

  // Update team settings by ID
  updateSettings: async (id: string, settings: Partial<TeamSettings>): Promise<TeamSettings> => {
    const response = await fetch(`${BASE_URL}/api/settings-team/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to update team settings');
    }
    return response.json();
  },

  // Delete team settings by ID
  deleteSettings: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/settings-team/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete team settings');
    }
  },
};
