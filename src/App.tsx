
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import DemoSessions from './pages/DemoSessions';
import SessionDetail from './pages/SessionDetail';
import UserManagement from './pages/UserManagement';
import UserProfile from './pages/UserProfile';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import MySessions from './pages/MySessions';
import MyProgress from './pages/MyProgress';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
// Settings pages
import ProfileSettings from './pages/settings/Profile';
import TeamSettings from './pages/settings/Team';
import NotificationSettings from './pages/settings/Notifications';
import ApiKeysSettings from './pages/settings/ApiKeys';
import AdvancedSettings from './pages/settings/Advanced';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <NotificationsProvider>
          <Router>
            <SidebarProvider>
              <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 flex w-full antialiased">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/demo-sessions" element={<DemoSessions />} />
                  <Route path="/session/:sessionId" element={<SessionDetail />} />
                  <Route path="/user-management" element={<UserManagement />} />
                  <Route path="/user-profile/:userId" element={<UserProfile />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/settings/profile" element={<ProfileSettings />} />
                  <Route path="/settings/team" element={<TeamSettings />} />
                  <Route path="/settings/notifications" element={<NotificationSettings />} />
                  <Route path="/settings/api-keys" element={<ApiKeysSettings />} />
                  <Route path="/settings/advanced" element={<AdvancedSettings />} />
                  <Route path="/my-sessions" element={<MySessions />} />
                  <Route path="/my-progress" element={<MyProgress />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </SidebarProvider>
          </Router>
        </NotificationsProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
