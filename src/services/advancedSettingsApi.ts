
import { BASE_URL } from './apiConfig';

export interface AdvancedSettings {
  id?: string;
  sessionTimeout: string;
  maxFileSize: string;
  enableDebugMode: boolean;
  autoBackup: boolean;
  maintenanceMode: boolean;
}

const API_BASE = `${BASE_URL}/api/advanced-settings`;

export const advancedSettingsApi = {
  async getAll(): Promise<AdvancedSettings[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error('Failed to fetch advanced settings');
    }
    return response.json();
  },

  async getById(id: string): Promise<AdvancedSettings> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch advanced setting');
    }
    return response.json();
  },

  async create(settingsData: Omit<AdvancedSettings, 'id'>): Promise<AdvancedSettings> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settingsData),
    });
    if (!response.ok) {
      throw new Error('Failed to create advanced settings');
    }
    return response.json();
  },

  async update(id: string, settingsData: Partial<AdvancedSettings>): Promise<AdvancedSettings> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settingsData),
    });
    if (!response.ok) {
      throw new Error('Failed to update advanced settings');
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete advanced settings');
    }
  },
};
