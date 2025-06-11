import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, X, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '../components/Layout';
import { sessionApi, type DemoSession } from '../services/api';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExtendedDemoSession extends DemoSession {
  currentStatus?: 'Planning' | 'In Progress' | 'Testing' | 'Completed' | 'On Hold';
}

const SessionDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [session, setSession] = useState<ExtendedDemoSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<{ [key: string]: boolean }>({});
  const [editingFields, setEditingFields] = useState<{ [key: string]: boolean }>({});
  const [editValues, setEditValues] = useState<Partial<ExtendedDemoSession>>({});

  // Convert backend format to frontend format for currentStatus
  const convertBackendToFrontend = (backendStatus: string): 'Planning' | 'In Progress' | 'Testing' | 'Completed' | 'On Hold' => {
    switch (backendStatus) {
      case 'In_Progress':
        return 'In Progress';
      case 'On_Hold':
        return 'On Hold';
      case 'Planning':
        return 'Planning';
      case 'Testing':
        return 'Testing';
      case 'Completed':
        return 'Completed';
      default:
        return 'Planning';
    }
  };

  // Convert frontend format to backend format for currentStatus
  const convertFrontendToBackend = (frontendStatus: 'Planning' | 'In Progress' | 'Testing' | 'Completed' | 'On Hold'): string => {
    switch (frontendStatus) {
      case 'In Progress':
        return 'In_Progress';
      case 'On Hold':
        return 'On_Hold';
      default:
        return frontendStatus;
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      try {
        if (!sessionId) {
          throw new Error("Session ID is missing.");
        }
        const fetchedSession = await sessionApi.get(sessionId);

        // Convert the API response to frontend format before setting state
        const convertedSession: ExtendedDemoSession = {
          ...fetchedSession,
          currentStatus: fetchedSession.currentStatus ? convertBackendToFrontend(fetchedSession.currentStatus as string) : 'Planning'
        };

        setSession(convertedSession);
        setEditValues(convertedSession);
      } catch (error) {
        console.error("Failed to fetch session:", error);
        toast({
          title: "Error",
          description: "Failed to load session details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, toast]);

  const handleEdit = (field: string) => {
    setEditingFields(prev => ({ ...prev, [field]: true }));
  };

  const handleCancel = (field: string) => {
    setEditingFields(prev => {
      const newState = { ...prev };
      delete newState[field];
      return newState;
    });
    setEditValues(session || {});
  };

  const handleSave = async (field: string) => {
    if (!session) return;

    console.log(`Saving field: ${field}`);
    console.log('Current editValues:', editValues);
    console.log('Current session:', session);

    try {
      setIsSaving(prev => ({ ...prev, [field]: true }));

      // Prepare the data to send to the API
      let updateData: any = {};
      
      if (field === 'currentStatus') {
        // Convert frontend format to backend format for API
        const backendStatus = convertFrontendToBackend(editValues.currentStatus!);
        updateData.currentStatus = backendStatus;
        console.log('Converted status for API:', backendStatus);
      } else {
        updateData[field] = editValues[field as keyof typeof editValues];
      }

      console.log('Sending update data to API:', updateData);

      // Call the API
      const result = await sessionApi.update(session.id, updateData);
      console.log('Received response from API:', result);
      
      // Convert the API response to frontend format before updating state
      const convertedResult: Partial<ExtendedDemoSession> = {
        ...result
      };
      
      if (result.currentStatus) {
        convertedResult.currentStatus = convertBackendToFrontend(result.currentStatus as string);
      }
      
      // Update the session state with the converted response data
      setSession(prev => {
        if (!prev) return null;
        const updatedSession: ExtendedDemoSession = {
          ...prev,
          ...convertedResult
        };
        console.log('Updated session state:', updatedSession);
        return updatedSession;
      });

      // Update editValues to match the new session data
      setEditValues(prev => ({
        ...prev,
        ...convertedResult
      }));

      setEditingFields(prev => {
        const newState = { ...prev };
        delete newState[field];
        return newState;
      });

      toast({
        title: "Session Updated",
        description: `${field.charAt(0).toUpperCase() + field.slice(1)} has been updated successfully.`,
      });

    } catch (error) {
      console.error(`Failed to save ${field}:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${field}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(prev => ({ ...prev, [field]: false }));
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-lg">Session not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center mb-2">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sessions
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 ml-2">{session.title}</h1>
        </div>
        <div className="text-lg text-gray-500 mb-4">Session Details</div>

        {/* Session Overview */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Session Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
              <div>
                <div className="text-gray-500 font-medium">Technology</div>
                <Badge variant="outline" className="mt-1">{session.technology}</Badge>
              </div>
              <div>
                <div className="text-gray-500 font-medium">Type</div>
                {editingFields['type'] ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Select value={editValues.type || ''} onValueChange={(value) => setEditValues(prev => ({ ...prev, type: value as 'PROJECT_BASED' | 'PRODUCT_BASED' }))}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder={editValues.type || 'Select type'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PROJECT_BASED">Project-based</SelectItem>
                        <SelectItem value="PRODUCT_BASED">Product-based</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={() => handleSave('type')} disabled={isSaving['type']}>
                      {isSaving['type'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('type')}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <Badge className="bg-indigo-100 text-indigo-800">{session.type === 'PROJECT_BASED' ? 'Project-based' : 'Product-based'}</Badge>
                    <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleEdit('type')}><Edit className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-500 font-medium">Status</div>
                <Badge className="bg-blue-100 text-blue-800 mt-1">{session.currentStatus || session.status}</Badge>
              </div>
              <div className="col-span-1 md:col-span-2 flex items-center space-x-8 mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500"><span className="inline-block align-middle"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span> {session.date}</span>
                  <span className="text-gray-500 ml-6"><span className="inline-block align-middle"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 6v6l4 2" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="#64748b" strokeWidth="2"/></svg></span> {session.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500"><span className="inline-block align-middle"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="#64748b" strokeWidth="2"/></svg></span> {session.attendees} / {session.maxAttendees} attendees</span>
                  <span className="text-gray-500 ml-6"><span className="inline-block align-middle"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 17.75l-6.16 3.24 1.18-6.88L2 9.76l6.92-1L12 2.5l3.08 6.26 6.92 1-5.02 4.35 1.18 6.88z" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round"/></svg></span> {session.rating ? `${session.rating}/5` : '-'}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-gray-500 font-medium">Difficulty</div>
                <Badge className={session.difficulty === 'Advanced' ? 'bg-red-100 text-red-800' : session.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>{session.difficulty}</Badge>
              </div>
              <div className="mt-4">
                <div className="text-gray-500 font-medium">Location</div>
                <span className="inline-flex items-center"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10Z" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="11" r="2" stroke="#64748b" strokeWidth="2"/></svg></span> {session.location}</div>
            </div>
          </CardContent>
        </Card>

        {/* Sprint Information */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Sprint Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="text-gray-500 font-medium">Sprint Name</div>
                {editingFields['sprintName'] ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      value={editValues.sprintName || ''}
                      onChange={e => setEditValues(prev => ({ ...prev, sprintName: e.target.value }))}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleSave('sprintName')} disabled={isSaving['sprintName']}>
                      {isSaving['sprintName'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('sprintName')}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <span>{session.sprintName || '-'}</span>
                    <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleEdit('sprintName')}><Edit className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-500 font-medium">Story Points</div>
                {editingFields['storyPoints'] ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      type="number"
                      value={editValues.storyPoints || ''}
                      onChange={e => setEditValues(prev => ({ ...prev, storyPoints: Number(e.target.value) }))}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleSave('storyPoints')} disabled={isSaving['storyPoints']}>
                      {isSaving['storyPoints'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('storyPoints')}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <span>{session.storyPoints || '-'}</span>
                    <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleEdit('storyPoints')}><Edit className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-500 font-medium">Number of Tasks</div>
                {editingFields['numberOfTasks'] ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      type="number"
                      value={editValues.numberOfTasks || ''}
                      onChange={e => setEditValues(prev => ({ ...prev, numberOfTasks: Number(e.target.value) }))}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleSave('numberOfTasks')} disabled={isSaving['numberOfTasks']}>
                      {isSaving['numberOfTasks'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('numberOfTasks')}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <span>{session.numberOfTasks || '-'}</span>
                    <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleEdit('numberOfTasks')}><Edit className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-500 font-medium">Number of Bugs</div>
                {editingFields['numberOfBugs'] ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      type="number"
                      value={editValues.numberOfBugs || ''}
                      onChange={e => setEditValues(prev => ({ ...prev, numberOfBugs: Number(e.target.value) }))}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleSave('numberOfBugs')} disabled={isSaving['numberOfBugs']}>
                      {isSaving['numberOfBugs'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('numberOfBugs')}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <span>{session.numberOfBugs || '-'}</span>
                    <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleEdit('numberOfBugs')}><Edit className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-500 font-medium">Current Status</div>
                {editingFields['currentStatus'] ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Select value={editValues.currentStatus || ''} onValueChange={value => setEditValues(prev => ({ ...prev, currentStatus: value as any }))}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder={editValues.currentStatus || 'Select status'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Testing">Testing</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={() => handleSave('currentStatus')} disabled={isSaving['currentStatus']}>
                      {isSaving['currentStatus'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('currentStatus')}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <Badge className="bg-blue-100 text-blue-800">{session.currentStatus || '-'}</Badge>
                    <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleEdit('currentStatus')}><Edit className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Details */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Session Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="text-gray-500 font-medium">Description</div>
                {editingFields['description'] ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Textarea
                      value={editValues.description || ''}
                      onChange={e => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleSave('description')} disabled={isSaving['description']}>
                      {isSaving['description'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('description')}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <span>{session.description || '-'}</span>
                    <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleEdit('description')}><Edit className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-500 font-medium">Prerequisites</div>
                {editingFields['prerequisites'] ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Textarea
                      value={editValues.prerequisites || ''}
                      onChange={e => setEditValues(prev => ({ ...prev, prerequisites: e.target.value }))}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleSave('prerequisites')} disabled={isSaving['prerequisites']}>
                      {isSaving['prerequisites'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('prerequisites')}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <span>{session.prerequisites || '-'}</span>
                    <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleEdit('prerequisites')}><Edit className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-500 font-medium">Feedback</div>
                {editingFields['feedback'] ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Textarea
                      value={editValues.feedback || ''}
                      onChange={e => setEditValues(prev => ({ ...prev, feedback: e.target.value }))}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleSave('feedback')} disabled={isSaving['feedback']}>
                      {isSaving['feedback'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('feedback')}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <span>{session.feedback || '-'}</span>
                    <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleEdit('feedback')}><Edit className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-500 font-medium">Duration (minutes)</div>
                {editingFields['duration'] ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      type="number"
                      value={editValues.duration || ''}
                      onChange={e => setEditValues(prev => ({ ...prev, duration: Number(e.target.value) }))}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleSave('duration')} disabled={isSaving['duration']}>
                      {isSaving['duration'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('duration')}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <span>{session.duration || '-'}</span>
                    <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleEdit('duration')}><Edit className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-500 font-medium">Created By</div>
                {editingFields['createdBy'] ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      value={editValues.createdBy || ''}
                      onChange={e => setEditValues(prev => ({ ...prev, createdBy: e.target.value }))}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleSave('createdBy')} disabled={isSaving['createdBy']}>
                      {isSaving['createdBy'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('createdBy')}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <span>{session.createdBy || '-'}</span>
                    <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleEdit('createdBy')}><Edit className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SessionDetail;
