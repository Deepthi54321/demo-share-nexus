
// API Error interfaces
export interface ApiError extends Error {
  status?: number;
  data?: {
    message?: string;
  };
}

export interface ApiErrorResponse {
  message?: string;
  status?: number;
  data?: {
    message?: string;
  };
}

// Demo Session interface
export interface DemoSession {
  id: string;
  title: string;
  technology: string;
  date: string;
  time: string;
  description: string;
  createdBy: string;
  attendees: number;
  maxAttendees: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites?: string;
  duration?: number;
  type: 'PROJECT_BASED' | 'PRODUCT_BASED';
  feedback?: string;
  sprintName?: string;
  storyPoints?: number;
  numberOfTasks?: number;
  numberOfBugs?: number;
  currentStatus?: 'Planning' | 'In Progress' | 'Testing' | 'Completed' | 'On Hold';
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  phone?: string;
  skillLevel: string;
  joinDate: string;
  lastLogin: string;
  sessionsAttended: number;
  sessionsCreated: number;
  totalHours: number;
  avatar?: string;
}
