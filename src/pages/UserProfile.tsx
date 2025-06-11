import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Mail, Phone, Calendar, Award, Users } from 'lucide-react';
import { userApi, User } from '../services/api';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) {
          throw new Error('User ID is required');
        }
        const userData = await userApi.getById(userId);
        setUser(userData);
      } catch (error: any) {
        console.error('Error fetching user:', error);
        toast({
          title: "Error",
          description: error.data?.message || "Failed to fetch user details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading user details...</h1>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <Button onClick={() => navigate('/user-management')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to User Management
          </Button>
        </div>
      </Layout>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? 
      <Badge className="bg-purple-100 text-purple-800 border-purple-300">Admin</Badge> :
      <Badge variant="outline">Employee</Badge>;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate('/user-management')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to User Management
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    {getRoleBadge(user.role)}
                    {getStatusBadge(user.status)}
                  </div>
                  <div className="text-sm text-gray-500 mt-2 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {user.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Department</div>
                  <div className="font-medium">{user.department}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Join Date</div>
                  <div className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {user.joinDate}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Skill Level</div>
                  <div className="font-medium flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    {user.skillLevel}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Sessions</div>
                  <div className="font-medium flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {user.sessionsAttended} Attended
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Total Hours</div>
                  <div className="text-2xl font-bold">{user.totalHours}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Sessions Attended</div>
                  <div className="text-2xl font-bold">{user.sessionsAttended}</div>
                </div>
                {user.role === 'admin' && (
                  <div>
                    <div className="text-sm text-gray-500">Sessions Created</div>
                    <div className="text-2xl font-bold">{user.sessionsCreated}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-500">Last Login</div>
                  <div className="text-sm font-medium">{new Date(user.lastLogin).toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
