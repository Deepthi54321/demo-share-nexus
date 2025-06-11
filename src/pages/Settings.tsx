import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Users, Bell, Key, Save, Shield, Mail, Phone, Building, User2, Edit, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Layout } from '../components/Layout';
import { useAdmin } from '../contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';
import { teamSettingsApi, type TeamSettings } from '../services/teamSettingsApi';
import { notificationSettingsApi, type NotificationSettings } from '../services/notificationSettingsApi';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

const Settings = () => {
  const { adminProfile, updateAdminProfile, isLoading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  useEffect(() => {
    const tab = searchParams.get('tab') || 'profile';
    setActiveTab(tab);
  }, [searchParams]);

  // Edit mode states for each tab
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [isEditingNotifications, setIsEditingNotifications] = useState(false);
  const [isEditingAdvanced, setIsEditingAdvanced] = useState(false);
  
  // Local state for form inputs
  const [profileForm, setProfileForm] = useState(adminProfile);
  const [originalProfileForm, setOriginalProfileForm] = useState(adminProfile);
  const [isSaving, setIsSaving] = useState(false);

  // Update form when adminProfile changes
  useEffect(() => {
    setProfileForm(adminProfile);
    setOriginalProfileForm(adminProfile);
  }, [adminProfile]);

  // Team settings state with API integration
  const [teamSettings, setTeamSettings] = useState<TeamSettings>({
    maxSessionsPerDay: '10',
    autoApproveRegistrations: true,
    requireManagerApproval: false,
    sessionReminderHours: '24'
  });
  const [originalTeamSettings, setOriginalTeamSettings] = useState<TeamSettings>({
    maxSessionsPerDay: '10',
    autoApproveRegistrations: true,
    requireManagerApproval: false,
    sessionReminderHours: '24'
  });
  const [teamSettingsId, setTeamSettingsId] = useState<string | null>(null);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);

  // Notification settings state with API integration
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

  // Load team settings from API
  useEffect(() => {
    const loadTeamSettings = async () => {
      try {
        setIsLoadingTeam(true);
        const settings = await teamSettingsApi.getSettings();
        if (settings.length > 0) {
          const teamData = settings[0];
          setTeamSettings(teamData);
          setOriginalTeamSettings(teamData);
          setTeamSettingsId(teamData.id || null);
        }
      } catch (error) {
        console.error('Failed to load team settings:', error);
      } finally {
        setIsLoadingTeam(false);
      }
    };

    loadTeamSettings();
  }, []);

  // Load notification settings from API
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

  // API keys state
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Production API', key: 'sk-***************8392', created: '2024-01-15', lastUsed: '2024-01-12' },
    { id: '2', name: 'Development API', key: 'sk-***************2847', created: '2024-01-20', lastUsed: '2024-01-11' }
  ]);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState(null); // null for create, or apiKey object for edit
  const [apiKeyForm, setApiKeyForm] = useState({ name: '', key: '', created: '', lastUsed: '' });

  const openCreateApiKeyModal = () => {
    setEditingApiKey(null);
    setApiKeyForm({ name: '', key: '', created: new Date().toISOString().split('T')[0], lastUsed: new Date().toISOString().split('T')[0] });
    setApiKeyModalOpen(true);
  };

  const openEditApiKeyModal = (apiKey) => {
    setEditingApiKey(apiKey);
    setApiKeyForm({ ...apiKey });
    setApiKeyModalOpen(true);
  };

  const handleApiKeyFormChange = (e) => {
    const { name, value } = e.target;
    setApiKeyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleApiKeyFormSave = () => {
    if (editingApiKey) {
      // Update existing
      setApiKeys((prev) => prev.map((k) => (k.id === editingApiKey.id ? { ...k, ...apiKeyForm } : k)));
    } else {
      // Create new
      setApiKeys((prev) => [
        ...prev,
        {
          ...apiKeyForm,
          id: Math.random().toString(36).substr(2, 9),
          created: apiKeyForm.created || new Date().toISOString().split('T')[0],
          lastUsed: apiKeyForm.lastUsed || new Date().toISOString().split('T')[0],
        },
      ]);
    }
    setApiKeyModalOpen(false);
  };

  // Advanced settings state
  const [advancedSettings, setAdvancedSettings] = useState({
    sessionTimeout: '30',
    maxFileSize: '10',
    enableDebugMode: false,
    autoBackup: true,
    maintenanceMode: false
  });
  const [originalAdvancedSettings, setOriginalAdvancedSettings] = useState({
    sessionTimeout: '30',
    maxFileSize: '10',
    enableDebugMode: false,
    autoBackup: true,
    maintenanceMode: false
  });

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setOriginalProfileForm({ ...profileForm });
  };

  const handleProfileCancel = () => {
    setProfileForm({ ...originalProfileForm });
    setIsEditingProfile(false);
  };

  const handleProfileSave = async () => {
    try {
      setIsSaving(true);
      await updateAdminProfile(profileForm);
      setIsEditingProfile(false);
      toast({
        title: "Profile Updated",
        description: "Your profile settings have been saved and are now reflected throughout the application.",
      });
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Updated team handlers with API integration
  const handleTeamEdit = () => {
    setIsEditingTeam(true);
    setOriginalTeamSettings({ ...teamSettings });
  };

  const handleTeamCancel = () => {
    setTeamSettings({ ...originalTeamSettings });
    setIsEditingTeam(false);
  };

  const handleTeamSave = async () => {
    try {
      setIsSaving(true);
      
      if (teamSettingsId) {
        // Update existing settings
        const updatedSettings = await teamSettingsApi.updateSettings(teamSettingsId, teamSettings);
        setTeamSettings(updatedSettings);
        setOriginalTeamSettings(updatedSettings);
      } else {
        // Create new settings
        const newSettings = await teamSettingsApi.createSettings(teamSettings);
        setTeamSettings(newSettings);
        setOriginalTeamSettings(newSettings);
        setTeamSettingsId(newSettings.id || null);
      }
      
      setIsEditingTeam(false);
      toast({
        title: "Team Settings Saved",
        description: "Team management settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to save team settings:', error);
      toast({
        title: "Error",
        description: "Failed to save team settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Updated notification handlers with API integration
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
        // Update existing settings
        const updatedSettings = await notificationSettingsApi.updateSettings(notificationSettingsId, notificationSettings);
        setNotificationSettings(updatedSettings);
        setOriginalNotificationSettings(updatedSettings);
      } else {
        // Create new settings
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

  const handleAdvancedEdit = () => {
    setIsEditingAdvanced(true);
    setOriginalAdvancedSettings({ ...advancedSettings });
  };

  const handleAdvancedCancel = () => {
    setAdvancedSettings({ ...originalAdvancedSettings });
    setIsEditingAdvanced(false);
  };

  const handleAdvancedSave = () => {
    setIsEditingAdvanced(false);
    toast({
      title: "Advanced Settings Saved",
      description: "System settings have been updated successfully.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your application preferences and configurations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <User2 className="h-5 w-5 mr-2" />
                      Profile Information
                      {adminLoading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and profile settings
                    </CardDescription>
                  </div>
                  {!isEditingProfile ? (
                    <Button 
                      onClick={handleProfileEdit} 
                      variant="outline" 
                      className="flex items-center space-x-2"
                      disabled={adminLoading}
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleProfileSave} 
                        variant="default" 
                        className="flex items-center space-x-2"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        <span>Save</span>
                      </Button>
                      <Button 
                        onClick={handleProfileCancel} 
                        variant="outline" 
                        className="flex items-center space-x-2"
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      readOnly={!isEditingProfile}
                      className={!isEditingProfile ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        className={`pl-10 ${!isEditingProfile ? "bg-gray-50" : ""}`}
                        placeholder="Enter your email"
                        readOnly={!isEditingProfile}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        className={`pl-10 ${!isEditingProfile ? "bg-gray-50" : ""}`}
                        placeholder="Enter your phone number"
                        readOnly={!isEditingProfile}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <Building className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="department"
                        value={profileForm.department}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, department: e.target.value }))}
                        className={`pl-10 ${!isEditingProfile ? "bg-gray-50" : ""}`}
                        placeholder="Enter your department"
                        readOnly={!isEditingProfile}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profileForm.company}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Enter your company name"
                      readOnly={!isEditingProfile}
                      className={!isEditingProfile ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      readOnly={!isEditingProfile}
                      className={!isEditingProfile ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Team Management
                      {isLoadingTeam && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                    </CardTitle>
                    <CardDescription>
                      Configure team-wide settings and policies
                    </CardDescription>
                  </div>
                  {!isEditingTeam ? (
                    <Button onClick={handleTeamEdit} variant="outline" className="flex items-center space-x-2" disabled={isLoadingTeam}>
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleTeamSave} variant="default" className="flex items-center space-x-2" disabled={isSaving}>
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        <span>Save</span>
                      </Button>
                      <Button onClick={handleTeamCancel} variant="outline" className="flex items-center space-x-2" disabled={isSaving}>
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxSessions">Max Sessions Per Day</Label>
                    <Input
                      id="maxSessions"
                      type="number"
                      value={teamSettings.maxSessionsPerDay}
                      onChange={(e) => setTeamSettings(prev => ({ ...prev, maxSessionsPerDay: e.target.value }))}
                      readOnly={!isEditingTeam}
                      className={!isEditingTeam ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reminderHours">Session Reminder (Hours)</Label>
                    <Input
                      id="reminderHours"
                      type="number"
                      value={teamSettings.sessionReminderHours}
                      onChange={(e) => setTeamSettings(prev => ({ ...prev, sessionReminderHours: e.target.value }))}
                      readOnly={!isEditingTeam}
                      className={!isEditingTeam ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-approve Registrations</Label>
                      <p className="text-sm text-gray-500">Automatically approve new user registrations</p>
                    </div>
                    <Switch
                      checked={teamSettings.autoApproveRegistrations}
                      onCheckedChange={(checked) => setTeamSettings(prev => ({ ...prev, autoApproveRegistrations: checked }))}
                      disabled={!isEditingTeam}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Manager Approval</Label>
                      <p className="text-sm text-gray-500">Require manager approval for session creation</p>
                    </div>
                    <Switch
                      checked={teamSettings.requireManagerApproval}
                      onCheckedChange={(checked) => setTeamSettings(prev => ({ ...prev, requireManagerApproval: checked }))}
                      disabled={!isEditingTeam}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
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
              <CardContent className="space-y-6">
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
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Keys
                </CardTitle>
                <CardDescription>
                  Manage your API keys for external integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{key.name}</div>
                        <div className="text-sm text-gray-500 font-mono">{key.key}</div>
                        <div className="text-xs text-gray-400">
                          Created: {new Date(key.created).toLocaleDateString()} •
                          Last used: {new Date(key.lastUsed).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex items-center space-x-2" onClick={() => openEditApiKeyModal(key)}>
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={openCreateApiKeyModal}>Create New API Key</Button>
                <Dialog open={apiKeyModalOpen} onOpenChange={setApiKeyModalOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingApiKey ? 'Edit API Key' : 'Create New API Key'}</DialogTitle>
                      <DialogDescription>
                        {editingApiKey ? 'Update the details of your API key.' : 'Enter details for the new API key.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="apiKeyName">Name</Label>
                        <Input id="apiKeyName" name="name" value={apiKeyForm.name} onChange={handleApiKeyFormChange} placeholder="API Key Name" />
                      </div>
                      <div>
                        <Label htmlFor="apiKeyValue">Key</Label>
                        <Input id="apiKeyValue" name="key" value={apiKeyForm.key} onChange={handleApiKeyFormChange} placeholder="API Key Value" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleApiKeyFormSave}>{editingApiKey ? 'Save Changes' : 'Create Key'}</Button>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Advanced Settings
                    </CardTitle>
                    <CardDescription>
                      Configure advanced system settings and preferences
                    </CardDescription>
                  </div>
                  {!isEditingAdvanced ? (
                    <Button onClick={handleAdvancedEdit} variant="outline" className="flex items-center space-x-2">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleAdvancedSave} variant="default" className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </Button>
                      <Button onClick={handleAdvancedCancel} variant="outline" className="flex items-center space-x-2">
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={advancedSettings.sessionTimeout}
                      onChange={(e) => setAdvancedSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                      readOnly={!isEditingAdvanced}
                      className={!isEditingAdvanced ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={advancedSettings.maxFileSize}
                      onChange={(e) => setAdvancedSettings(prev => ({ ...prev, maxFileSize: e.target.value }))}
                      readOnly={!isEditingAdvanced}
                      className={!isEditingAdvanced ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Debug Mode</Label>
                      <p className="text-sm text-gray-500">Enable debug logging and developer tools</p>
                    </div>
                    <Switch
                      checked={advancedSettings.enableDebugMode}
                      onCheckedChange={(checked) => setAdvancedSettings(prev => ({ ...prev, enableDebugMode: checked }))}
                      disabled={!isEditingAdvanced}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Backup</Label>
                      <p className="text-sm text-gray-500">Automatically backup data daily</p>
                    </div>
                    <Switch
                      checked={advancedSettings.autoBackup}
                      onCheckedChange={(checked) => setAdvancedSettings(prev => ({ ...prev, autoBackup: checked }))}
                      disabled={!isEditingAdvanced}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-gray-500">Put the application in maintenance mode</p>
                    </div>
                    <Switch
                      checked={advancedSettings.maintenanceMode}
                      onCheckedChange={(checked) => setAdvancedSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                      disabled={!isEditingAdvanced}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
