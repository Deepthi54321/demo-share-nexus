
import { BASE_URL } from './apiConfig';

export interface SettingsApiKey {
  id?: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
}

const API_BASE = `${BASE_URL}/api/settings/api-keys`;

export const settingsApiKeysApi = {
  async getAll(): Promise<SettingsApiKey[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error('Failed to fetch API keys');
    }
    return response.json();
  },

  async getById(id: string): Promise<SettingsApiKey> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch API key');
    }
    return response.json();
  },

  async create(apiKeyData: Omit<SettingsApiKey, 'id'>): Promise<SettingsApiKey> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiKeyData),
    });
    if (!response.ok) {
      throw new Error('Failed to create API key');
    }
    return response.json();
  },

  async update(id: string, apiKeyData: Partial<SettingsApiKey>): Promise<SettingsApiKey> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiKeyData),
    });
    if (!response.ok) {
      throw new Error('Failed to update API key');
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete API key');
    }
  },
};
