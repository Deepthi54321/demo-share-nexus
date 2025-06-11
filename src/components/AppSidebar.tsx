
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, User, Home, BarChart3, Settings, PanelLeft, Bell, Key, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export const AppSidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const adminMenuItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Calendar, label: 'Demo Sessions', href: '/demo-sessions' },
    { icon: Users, label: 'User Management', href: '/user-management' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  ];

  const employeeMenuItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Calendar, label: 'My Sessions', href: '/my-sessions' },
    { icon: BarChart3, label: 'My Progress', href: '/my-progress' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : employeeMenuItems;

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200/60 bg-white shadow-sm">
      <SidebarHeader className="border-b border-slate-200/60 p-4 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:space-x-0">
            <div className="w-8 h-8 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg ring-1 ring-blue-600/20 transition-all duration-200">
              <Calendar className="h-4 w-4 group-data-[collapsible=icon]:h-3 group-data-[collapsible=icon]:w-3 text-white" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                Demo Tracker
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Knowledge Sharing Platform</p>
            </div>
          </div>
          <SidebarTrigger className="h-6 w-6 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex-shrink-0">
            <PanelLeft className="h-4 w-4" />
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2 bg-gradient-to-b from-white to-slate-50/30">
        <SidebarMenu className="space-y-1">
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                onClick={() => navigate(item.href)}
                isActive={location.pathname === item.href}
                tooltip={item.label}
                className={`w-full justify-start px-3 py-2.5 rounded-lg transition-all duration-300 group relative overflow-hidden group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 ${
                  location.pathname === item.href
                    ? 'bg-gradient-to-r from-blue-50 via-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50 shadow-md hover:shadow-lg'
                    : 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200/50'
                }`}
              >
                <div className="flex items-center space-x-3 relative z-10 group-data-[collapsible=icon]:space-x-0 group-data-[collapsible=icon]:justify-center">
                  <item.icon className={`h-4 w-4 transition-all duration-300 group-hover:scale-110 flex-shrink-0 ${
                    location.pathname === item.href ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                  }`} />
                  <span className="font-medium group-data-[collapsible=icon]:hidden">{item.label}</span>
                </div>
                {location.pathname === item.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-lg" />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {/* Settings Dropdown */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              isActive={location.pathname.startsWith('/settings')}
              tooltip="Settings"
              className="w-full justify-start px-3 py-2.5 rounded-lg transition-all duration-300 group relative overflow-hidden group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200/50"
            >
              <Settings className="h-4 w-4 text-slate-500 group-hover:text-slate-700" />
              <span className="font-medium group-data-[collapsible=icon]:hidden">Settings</span>
              <ChevronDown className={`ml-auto h-4 w-4 transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
            </SidebarMenuButton>
            {isSettingsOpen && (
              <div className="pl-4 mt-1 space-y-1">
                <SidebarMenuButton
                  onClick={() => navigate('/settings/profile')}
                  className="w-full justify-start px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <User className="mr-2 h-4 w-4 text-slate-500" /> Profile
                </SidebarMenuButton>
                <SidebarMenuButton
                  onClick={() => navigate('/settings/team')}
                  className="w-full justify-start px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <Users className="mr-2 h-4 w-4 text-slate-500" /> Team
                </SidebarMenuButton>
                <SidebarMenuButton
                  onClick={() => navigate('/settings/notifications')}
                  className="w-full justify-start px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <Bell className="mr-2 h-4 w-4 text-slate-500" /> Notifications
                </SidebarMenuButton>
                <SidebarMenuButton
                  onClick={() => navigate('/settings/api-keys')}
                  className="w-full justify-start px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <Key className="mr-2 h-4 w-4 text-slate-500" /> API Keys
                </SidebarMenuButton>
                <SidebarMenuButton
                  onClick={() => navigate('/settings/advanced')}
                  className="w-full justify-start px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <Settings className="mr-2 h-4 w-4 text-slate-500" /> Advanced
                </SidebarMenuButton>
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
