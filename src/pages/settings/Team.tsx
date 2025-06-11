
import React, { useState, useEffect } from 'react';
import { Users, Edit, X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Layout } from '../../components/Layout';
import { useToast } from '@/hooks/use-toast';
import { teamSettingsApi, type TeamSettings } from '../../services/teamSettingsApi';

const TeamSettings = () => {
  const { toast } = useToast();
  
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
        const updatedSettings = await teamSettingsApi.updateSettings(teamSettingsId, teamSettings);
        setTeamSettings(updatedSettings);
        setOriginalTeamSettings(updatedSettings);
      } else {
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

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-1">Configure team-wide settings and policies</p>
        </div>

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
      </div>
    </Layout>
  );
};

export default TeamSettings;
