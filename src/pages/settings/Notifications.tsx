
import React, { useState, useEffect } from 'react';
import { Bell, Edit, X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Layout } from '../../components/Layout';
import { useToast } from '@/hooks/use-toast';
import { notificationSettingsApi, type NotificationSettings } from '../../services/notificationSettingsApi';

const NotificationSettings = () => {
  const { toast } = useToast();
  
  const [isEditingNotifications, setIsEditingNotifications] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    sessionReminders: true,
    weeklyReports: false,
    marketingEmails: false
  });
  const [originalNotificationSettings, setOriginalNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    sessionReminders: true,
    weeklyReports: false,
    marketingEmails: false
  });
  const [notificationSettingsId, setNotificationSettingsId] = useState<string | null>(null);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        setIsLoadingNotifications(true);
        const settings = await notificationSettingsApi.getSettings();
        if (settings.length > 0) {
          const notificationData = settings[0];
          setNotificationSettings(notificationData);
          setOriginalNotificationSettings(notificationData);
          setNotificationSettingsId(notificationData.id || null);
        }
      } catch (error) {
        console.error('Failed to load notification settings:', error);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    loadNotificationSettings();
  }, []);

  const handleNotificationEdit = () => {
    setIsEditingNotifications(true);
    setOriginalNotificationSettings({ ...notificationSettings });
  };

  const handleNotificationCancel = () => {
    setNotificationSettings({ ...originalNotificationSettings });
    setIsEditingNotifications(false);
  };

  const handleNotificationSave = async () => {
    try {
      setIsSaving(true);
      
      if (notificationSettingsId) {
        const updatedSettings = await notificationSettingsApi.updateSettings(notificationSettingsId, notificationSettings);
        setNotificationSettings(updatedSettings);
        setOriginalNotificationSettings(updatedSettings);
      } else {
        const newSettings = await notificationSettingsApi.createSettings(notificationSettings);
        setNotificationSettings(newSettings);
        setOriginalNotificationSettings(newSettings);
        setNotificationSettingsId(newSettings.id || null);
      }
      
      setIsEditingNotifications(false);
      toast({
        title: "Notification Settings Saved", 
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to save notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
          <p className="text-gray-600 mt-1">Manage how you receive notifications and updates</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                  {isLoadingNotifications && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                </CardTitle>
                <CardDescription>
                  Manage how you receive notifications and updates
                </CardDescription>
              </div>
              {!isEditingNotifications ? (
                <Button onClick={handleNotificationEdit} variant="outline" className="flex items-center space-x-2" disabled={isLoadingNotifications}>
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleNotificationSave} variant="default" className="flex items-center space-x-2" disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>Save</span>
                  </Button>
                  <Button onClick={handleNotificationCancel} variant="outline" className="flex items-center space-x-2" disabled={isSaving}>
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {Object.entries(notificationSettings).filter(([key]) => key !== 'id').map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                    <p className="text-sm text-gray-500">
                      {key === 'emailNotifications' && 'Receive notifications via email'}
                      {key === 'pushNotifications' && 'Receive push notifications in browser'}
                      {key === 'sessionReminders' && 'Get reminded about upcoming sessions'}
                      {key === 'weeklyReports' && 'Receive weekly analytics reports'}
                      {key === 'marketingEmails' && 'Receive product updates and news'}
                    </p>
                  </div>
                  <Switch
                    checked={value as boolean}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, [key]: checked }))}
                    disabled={!isEditingNotifications}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotificationSettings;
