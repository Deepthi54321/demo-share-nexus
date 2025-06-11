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
      <div className="space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{session.title}</h1>
          <p className="text-gray-600 mt-1">View and manage session details</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Session Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="technology">Technology</Label>
                {editingFields['technology'] ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      id="technology"
                      value={editValues.technology || ''}
                      onChange={(e) => setEditValues(prev => ({ ...prev, technology: e.target.value }))}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleSave('technology')} disabled={isSaving['technology']}>
                      {isSaving['technology'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('technology')}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p>{session.technology}</p>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit('technology')}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                {editingFields['date'] ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      id="date"
                      type="date"
                      value={editValues.date || ''}
                      onChange={(e) => setEditValues(prev => ({ ...prev, date: e.target.value }))}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleSave('date')} disabled={isSaving['date']}>
                      {isSaving['date'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('date')}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p>{session.date}</p>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit('date')}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                {editingFields['time'] ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      id="time"
                      type="time"
                      value={editValues.time || ''}
                      onChange={(e) => setEditValues(prev => ({ ...prev, time: e.target.value }))}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleSave('time')} disabled={isSaving['time']}>
                      {isSaving['time'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('time')}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p>{session.time}</p>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit('time')}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                {editingFields['location'] ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      id="location"
                      value={editValues.location || ''}
                      onChange={(e) => setEditValues(prev => ({ ...prev, location: e.target.value }))}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleSave('location')} disabled={isSaving['location']}>
                      {isSaving['location'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('location')}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p>{session.location}</p>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit('location')}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="maxAttendees">Max Attendees</Label>
                {editingFields['maxAttendees'] ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      id="maxAttendees"
                      type="number"
                      value={editValues.maxAttendees?.toString() || ''}
                      onChange={(e) => setEditValues(prev => ({ ...prev, maxAttendees: Number(e.target.value) }))}
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleSave('maxAttendees')} disabled={isSaving['maxAttendees']}>
                      {isSaving['maxAttendees'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('maxAttendees')}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p>{session.maxAttendees}</p>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit('maxAttendees')}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                {editingFields['difficulty'] ? (
                  <div className="flex items-center space-x-2">
                    <Select onValueChange={(value) => setEditValues(prev => ({ ...prev, difficulty: value as 'Beginner' | 'Intermediate' | 'Advanced' }))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={editValues.difficulty || "Select difficulty"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={() => handleSave('difficulty')} disabled={isSaving['difficulty']}>
                      {isSaving['difficulty'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('difficulty')}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p>{session.difficulty}</p>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit('difficulty')}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                {editingFields['type'] ? (
                  <div className="flex items-center space-x-2">
                    <Select onValueChange={(value) => setEditValues(prev => ({ ...prev, type: value as 'PROJECT_BASED' | 'PRODUCT_BASED' }))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={editValues.type || "Select type"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PROJECT_BASED">Project Based</SelectItem>
                        <SelectItem value="PRODUCT_BASED">Product Based</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={() => handleSave('type')} disabled={isSaving['type']}>
                      {isSaving['type'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('type')}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p>{session.type}</p>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit('type')}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="currentStatus">Current Status</Label>
                {editingFields['currentStatus'] ? (
                  <div className="flex items-center space-x-2">
                    <Select onValueChange={(value) => setEditValues(prev => ({ ...prev, currentStatus: value as 'Planning' | 'In Progress' | 'Testing' | 'Completed' | 'On Hold' }))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={editValues.currentStatus || "Select status"} />
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
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('currentStatus')}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <Badge className={cn(
                      "bg-blue-100 text-blue-800",
                      session.currentStatus === 'Planning' && "bg-blue-100 text-blue-800",
                      session.currentStatus === 'In Progress' && "bg-yellow-100 text-yellow-800",
                      session.currentStatus === 'Testing' && "bg-purple-100 text-purple-800",
                      session.currentStatus === 'Completed' && "bg-green-100 text-green-800",
                      session.currentStatus === 'On Hold' && "bg-red-100 text-red-800"
                    )}>
                      {session.currentStatus}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit('currentStatus')}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              {editingFields['description'] ? (
                <div className="flex flex-col space-y-2">
                  <Textarea
                    id="description"
                    value={editValues.description || ''}
                    onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleSave('description')} disabled={isSaving['description']}>
                      {isSaving['description'] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel('description')}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p>{session.description}</p>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit('description')}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SessionDetail;
