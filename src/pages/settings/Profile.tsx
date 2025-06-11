
import React, { useState, useEffect } from 'react';
import { User2, Edit, X, Save, Loader2, Mail, Phone, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '../../components/Layout';
import { useAdmin } from '../../contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';

const ProfileSettings = () => {
  const { adminProfile, updateAdminProfile, isLoading: adminLoading } = useAdmin();
  const { toast } = useToast();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(adminProfile);
  const [originalProfileForm, setOriginalProfileForm] = useState(adminProfile);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setProfileForm(adminProfile);
    setOriginalProfileForm(adminProfile);
  }, [adminProfile]);

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

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and profile settings</p>
        </div>

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
      </div>
    </Layout>
  );
};

export default ProfileSettings;
