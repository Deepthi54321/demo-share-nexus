
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DemoSessionCard } from './DemoSessionCard';
import { EditSessionModal } from './EditSessionModal';
import { sessionApi, DemoSession } from '../services/api';
import { toast } from '@/hooks/use-toast';

export const AdminDashboard: React.FC = () => {
  const [demoSessions, setDemoSessions] = useState<DemoSession[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<DemoSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch demo sessions on component mount
  useEffect(() => {
    const fetchDemoSessions = async () => {
      try {
        setIsLoadingData(true);
        const sessions = await sessionApi.getAll();
        setDemoSessions(sessions);
      } catch (error) {
        console.error('Error fetching demo sessions:', error);
        toast({
          title: "Error",
          description: "Failed to fetch demo sessions. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDemoSessions();
  }, []);

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await sessionApi.delete(sessionId);
      setDemoSessions(prev => prev.filter(session => session.id !== sessionId));
      toast({
        title: "Session Deleted",
        description: "The demo session has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditSession = (session: DemoSession) => {
    setEditingSession(session);
    setIsEditModalOpen(true);
  };

  const handleUpdateSession = async (updatedSession: DemoSession) => {
    if (!editingSession) return;

    setIsLoading(true);
    try {
      const updatedSessionData = await sessionApi.update(editingSession.id, updatedSession);
      setDemoSessions(prev => prev.map(session => 
        session.id === editingSession.id ? updatedSessionData : session
      ));
      setIsEditModalOpen(false);
      setEditingSession(null);
      toast({
        title: "Session Updated",
        description: "The demo session has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating session:', error);
      toast({
        title: "Error",
        description: "Failed to update session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    { title: 'Total Sessions', value: demoSessions.length, icon: Calendar, color: 'bg-blue-500' },
    { title: 'Upcoming Sessions', value: demoSessions.filter(s => s.status === 'upcoming').length, icon: Clock, color: 'bg-green-500' },
    { title: 'Total Attendees', value: demoSessions.reduce((sum, s) => sum + s.attendees, 0), icon: Users, color: 'bg-purple-500' },
  ];

  if (isLoadingData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Demo Session Management</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading demo sessions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Demo Session Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Demo Sessions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Demo Sessions</h2>
        {demoSessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No demo sessions found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {demoSessions.map((session) => (
              <DemoSessionCard
                key={session.id}
                session={session}
                onEdit={() => handleEditSession(session)}
                onDelete={handleDeleteSession}
                isAdmin={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Session Modal */}
      <EditSessionModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        session={editingSession}
        onEditSession={handleUpdateSession}
        loading={isLoading}
      />
    </div>
  );
};
