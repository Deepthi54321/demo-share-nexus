
import React, { useState, useEffect } from 'react';
import { Shield, Edit, X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Layout } from '../../components/Layout';
import { useToast } from '@/hooks/use-toast';
import { advancedSettingsApi, type AdvancedSettings } from '../../services/advancedSettingsApi';

const AdvancedSettings = () => {
  const { toast } = useToast();
  
  const [isEditingAdvanced, setIsEditingAdvanced] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    sessionTimeout: '30',
    maxFileSize: '10',
    enableDebugMode: false,
    autoBackup: true,
    maintenanceMode: false
  });
  const [originalAdvancedSettings, setOriginalAdvancedSettings] = useState<AdvancedSettings>({
    sessionTimeout: '30',
    maxFileSize: '10',
    enableDebugMode: false,
    autoBackup: true,
    maintenanceMode: false
  });
  const [advancedSettingsId, setAdvancedSettingsId] = useState<string | null>(null);
  const [isLoadingAdvanced, setIsLoadingAdvanced] = useState(false);

  useEffect(() => {
    const loadAdvancedSettings = async () => {
      try {
        setIsLoadingAdvanced(true);
        const settings = await advancedSettingsApi.getAll();
        if (settings.length > 0) {
          const advancedData = settings[0];
          setAdvancedSettings(advancedData);
          setOriginalAdvancedSettings(advancedData);
          setAdvancedSettingsId(advancedData.id || null);
        }
      } catch (error) {
        console.error('Failed to load advanced settings:', error);
      } finally {
        setIsLoadingAdvanced(false);
      }
    };

    loadAdvancedSettings();
  }, []);

  const handleAdvancedEdit = () => {
    setIsEditingAdvanced(true);
    setOriginalAdvancedSettings({ ...advancedSettings });
  };

  const handleAdvancedCancel = () => {
    setAdvancedSettings({ ...originalAdvancedSettings });
    setIsEditingAdvanced(false);
  };

  const handleAdvancedSave = async () => {
    try {
      setIsSaving(true);
      
      if (advancedSettingsId) {
        const updatedSettings = await advancedSettingsApi.update(advancedSettingsId, advancedSettings);
        setAdvancedSettings(updatedSettings);
        setOriginalAdvancedSettings(updatedSettings);
      } else {
        const newSettings = await advancedSettingsApi.create(advancedSettings);
        setAdvancedSettings(newSettings);
        setOriginalAdvancedSettings(newSettings);
        setAdvancedSettingsId(newSettings.id || null);
      }
      
      setIsEditingAdvanced(false);
      toast({
        title: "Advanced Settings Saved",
        description: "System settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to save advanced settings:', error);
      toast({
        title: "Error",
        description: "Failed to save advanced settings. Please try again.",
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
          <h1 className="text-3xl font-bold text-gray-900">Advanced Settings</h1>
          <p className="text-gray-600 mt-1">Configure advanced system settings and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Advanced Settings
                  {isLoadingAdvanced && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                </CardTitle>
                <CardDescription>
                  Configure advanced system settings and preferences
                </CardDescription>
              </div>
              {!isEditingAdvanced ? (
                <Button onClick={handleAdvancedEdit} variant="outline" className="flex items-center space-x-2" disabled={isLoadingAdvanced}>
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleAdvancedSave} variant="default" className="flex items-center space-x-2" disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>Save</span>
                  </Button>
                  <Button onClick={handleAdvancedCancel} variant="outline" className="flex items-center space-x-2" disabled={isSaving}>
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
      </div>
    </Layout>
  );
};

export default AdvancedSettings;
