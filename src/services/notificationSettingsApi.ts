
import { BASE_URL } from './apiConfig';

export interface NotificationSettings {
  id?: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  sessionReminders: boolean;
  weeklyReports: boolean;
  marketingEmails: boolean;
}

export const notificationSettingsApi = {
  // Fetch all notification settings
  getSettings: async (): Promise<NotificationSettings[]> => {
    const response = await fetch(`${BASE_URL}/api/notification-settings`);
    if (!response.ok) {
      throw new Error('Failed to fetch notification settings');
    }
    return response.json();
  },

  // Create new notification settings
  createSettings: async (settings: Omit<NotificationSettings, 'id'>): Promise<NotificationSettings> => {
    const response = await fetch(`${BASE_URL}/api/notification-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to create notification settings');
    }
    return response.json();
  },

  // Update notification settings by ID
  updateSettings: async (id: string, settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    const response = await fetch(`${BASE_URL}/api/notification-settings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to update notification settings');
    }
    return response.json();
  },

  // Delete notification settings by ID
  deleteSettings: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/notification-settings/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete notification settings');
    }
  },
};
