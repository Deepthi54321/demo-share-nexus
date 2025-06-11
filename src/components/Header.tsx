import React from 'react';
import { Bell, Settings, LogOut, User, Search, Users, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { adminProfile } = useAdmin();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Use admin profile if user is admin, otherwise use regular user data
  const displayName = user?.role === 'admin' ? adminProfile.name : user?.name;
  const displayEmail = user?.role === 'admin' ? adminProfile.email : user?.email;

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search sessions, users, or settings..."
              className="pl-10 w-full bg-slate-50/50 border-slate-200 focus:bg-white focus:border-blue-300 transition-all duration-200 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3 ml-6">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative h-9 w-9 rounded-full hover:bg-slate-100 transition-colors duration-200"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-5 w-5 text-slate-600" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500 border-2 border-white">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 p-2 h-auto rounded-lg hover:bg-slate-100 transition-colors duration-200">
                <Avatar className="h-9 w-9 border-2 border-slate-200 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm">
                    {getInitials(displayName || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <div className="text-sm font-semibold text-slate-900">{displayName}</div>
                  <div className="text-xs text-slate-500 font-medium">{displayEmail}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 shadow-lg">
              <DropdownMenuLabel className="text-slate-900 font-semibold">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-200" />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Settings className="mr-3 h-4 w-4 text-slate-500" />
                  <span>Settings</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => navigate('/settings?tab=profile')}>
                    <User className="mr-3 h-4 w-4 text-slate-500" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings?tab=team')}>
                    <Users className="mr-3 h-4 w-4 text-slate-500" />
                    <span>Team</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings?tab=notifications')}>
                    <Bell className="mr-3 h-4 w-4 text-slate-500" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings?tab=api')}>
                    <Key className="mr-3 h-4 w-4 text-slate-500" />
                    <span>API Keys</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings?tab=advanced')}>
                    <Settings className="mr-3 h-4 w-4 text-slate-500" />
                    <span>Advanced</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator className="bg-slate-200" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-50 focus:bg-red-50 cursor-pointer"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
