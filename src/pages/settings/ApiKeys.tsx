
import React, { useState, useEffect } from 'react';
import { Key, Edit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '../../components/Layout';
import { useToast } from '@/hooks/use-toast';
import { settingsApiKeysApi, type SettingsApiKey } from '../../services/settingsApiKeysApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const ApiKeysSettings = () => {
  const { toast } = useToast();
  
  const [apiKeys, setApiKeys] = useState<SettingsApiKey[]>([]);
  const [isLoadingApiKeys, setIsLoadingApiKeys] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState<SettingsApiKey | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiKeyForm, setApiKeyForm] = useState<Omit<SettingsApiKey, 'id'>>({ 
    name: '', 
    key: '', 
    created: '', 
    lastUsed: '' 
  });

  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        setIsLoadingApiKeys(true);
        const keys = await settingsApiKeysApi.getAll();
        setApiKeys(keys);
      } catch (error) {
        console.error('Failed to load API keys:', error);
      } finally {
        setIsLoadingApiKeys(false);
      }
    };

    loadApiKeys();
  }, []);

  const openCreateApiKeyModal = () => {
    setEditingApiKey(null);
    setApiKeyForm({ 
      name: '', 
      key: '', 
      created: new Date().toISOString().split('T')[0], 
      lastUsed: new Date().toISOString().split('T')[0] 
    });
    setApiKeyModalOpen(true);
  };

  const openEditApiKeyModal = (apiKey: SettingsApiKey) => {
    setEditingApiKey(apiKey);
    setApiKeyForm({ 
      name: apiKey.name,
      key: apiKey.key,
      created: apiKey.created,
      lastUsed: apiKey.lastUsed
    });
    setApiKeyModalOpen(true);
  };

  const handleApiKeyFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiKeyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleApiKeyFormSave = async () => {
    try {
      setIsSaving(true);
      
      if (editingApiKey) {
        const updatedKey = await settingsApiKeysApi.update(editingApiKey.id!, apiKeyForm);
        setApiKeys((prev) => prev.map((k) => (k.id === editingApiKey.id ? updatedKey : k)));
      } else {
        const newKey = await settingsApiKeysApi.create(apiKeyForm);
        setApiKeys((prev) => [...prev, newKey]);
      }
      
      setApiKeyModalOpen(false);
      toast({
        title: editingApiKey ? "API Key Updated" : "API Key Created",
        description: editingApiKey ? "API key has been updated successfully." : "New API key has been created successfully.",
      });
    } catch (error) {
      console.error('Failed to save API key:', error);
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApiKeyDelete = async (apiKey: SettingsApiKey) => {
    try {
      await settingsApiKeysApi.delete(apiKey.id!);
      setApiKeys((prev) => prev.filter((k) => k.id !== apiKey.id));
      toast({
        title: "API Key Deleted",
        description: "API key has been deleted successfully.",
      });
    } catch (error) {
      console.error('Failed to delete API key:', error);
      toast({
        title: "Error",
        description: "Failed to delete API key. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
          <p className="text-gray-600 mt-1">Manage your API keys for external integrations</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Keys
                  {isLoadingApiKeys && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                </CardTitle>
                <CardDescription>
                  Manage your API keys for external integrations
                </CardDescription>
              </div>
              <Button onClick={openCreateApiKeyModal}>Create New API Key</Button>
            </div>
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
                    <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleApiKeyDelete(key)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Dialog open={apiKeyModalOpen} onOpenChange={setApiKeyModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingApiKey ? 'Edit API Key' : 'Create New API Key'}</DialogTitle>
                  <DialogDescription>
                    {editingApiKey ? 'Update the API key details below.' : 'Fill in the details to create a new API key.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={apiKeyForm.name}
                      onChange={handleApiKeyFormChange}
                      placeholder="Enter API key name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="key">API Key</Label>
                    <Input
                      id="key"
                      name="key"
                      value={apiKeyForm.key}
                      onChange={handleApiKeyFormChange}
                      placeholder="Enter your API key"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="created">Created Date</Label>
                    <Input
                      id="created"
                      name="created"
                      type="date"
                      value={apiKeyForm.created}
                      onChange={handleApiKeyFormChange}
                      readOnly={!editingApiKey}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastUsed">Last Used Date</Label>
                    <Input
                      id="lastUsed"
                      name="lastUsed"
                      type="date"
                      value={apiKeyForm.lastUsed}
                      onChange={handleApiKeyFormChange}
                      readOnly={!editingApiKey}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setApiKeyModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleApiKeyFormSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ApiKeysSettings;
