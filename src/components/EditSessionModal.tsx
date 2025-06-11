import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface DemoSession {
  id: string;
  title: string;
  technology: string;
  date: string;
  time: string;
  description: string;
  createdBy: string;
  attendees: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
  maxAttendees: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'PROJECT_BASED' | 'PRODUCT_BASED';
  prerequisites?: string;
  duration?: number;
  feedback?: string;
  numberOfBugs?: number;
  numberOfTasks?: number;
  storyPoints?: number;
  sprintName?: string;
  rating?: number;
  currentStatus?: string;
}

interface EditSessionModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  session: DemoSession | null;
  onEditSession: (session: DemoSession) => void;
  loading: boolean;
}

const technologies = [
  'React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Java', 'TypeScript', 
  'JavaScript', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Azure',
  'GraphQL', 'REST API', 'Firebase', 'Next.js', 'Express.js', 'Django'
];

const locations = [
  'Conference Room A', 'Conference Room B', 'Main Hall', 'Tech Lab', 
  'Training Room 1', 'Training Room 2', 'Auditorium', 'Virtual/Online'
];

const currentStatusOptions = [
  'Planning',
  'In Progress', 
  'Testing',
  'Completed',
  'On Hold'
];

export const EditSessionModal: React.FC<EditSessionModalProps> = ({
  open,
  setOpen,
  session,
  onEditSession,
  loading
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: session?.title || '',
    technology: session?.technology || '',
    date: session?.date || '',
    time: session?.time || '',
    description: session?.description || '',
    location: session?.location || '',
    maxAttendees: session?.maxAttendees.toString() || '',
    attendees: session?.attendees.toString() || '',
    difficulty: session?.difficulty || '',
    type: session?.type || '',
    status: session?.status || '',
    prerequisites: session?.prerequisites || '',
    duration: session?.duration?.toString() || '',
    feedback: session?.feedback || '',
    createdBy: session?.createdBy || '',
    numberOfBugs: session?.numberOfBugs?.toString() || '',
    numberOfTasks: session?.numberOfTasks?.toString() || '',
    storyPoints: session?.storyPoints?.toString() || '',
    sprintName: session?.sprintName || '',
    rating: session?.rating?.toString() || '',
    currentStatus: session?.currentStatus || ''
  });

  useEffect(() => {
    if (session) {
      console.log('Loading session data into form:', session);
      setFormData({
        title: session.title || '',
        technology: session.technology || '',
        date: session.date || '',
        time: session.time || '',
        description: session.description || '',
        location: session.location || '',
        maxAttendees: session.maxAttendees?.toString() || '',
        attendees: session.attendees?.toString() || '',
        difficulty: session.difficulty || '',
        type: session.type || '',
        status: session.status || '',
        prerequisites: session.prerequisites || '',
        duration: session.duration?.toString() || '',
        feedback: session.feedback || '',
        createdBy: session.createdBy || '',
        numberOfBugs: session.numberOfBugs?.toString() || '',
        numberOfTasks: session.numberOfTasks?.toString() || '',
        storyPoints: session.storyPoints?.toString() || '',
        sprintName: session.sprintName || '',
        rating: session.rating?.toString() || '',
        currentStatus: session.currentStatus || ''
      });
    }
  }, [session]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.technology || !formData.date || !formData.time) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedSession = {
      id: session!.id,
      title: formData.title,
      technology: formData.technology,
      date: formData.date,
      time: formData.time,
      description: formData.description,
      location: formData.location,
      maxAttendees: parseInt(formData.maxAttendees),
      attendees: parseInt(formData.attendees),
      difficulty: formData.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
      type: formData.type as 'PROJECT_BASED' | 'PRODUCT_BASED',
      status: formData.status as 'upcoming' | 'completed' | 'cancelled',
      createdBy: formData.createdBy,
      prerequisites: formData.prerequisites || undefined,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      feedback: formData.feedback || undefined,
      numberOfBugs: formData.numberOfBugs ? parseInt(formData.numberOfBugs) : undefined,
      numberOfTasks: formData.numberOfTasks ? parseInt(formData.numberOfTasks) : undefined,
      storyPoints: formData.storyPoints ? parseInt(formData.storyPoints) : undefined,
      sprintName: formData.sprintName || undefined,
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
      currentStatus: formData.currentStatus || undefined
    };
    
    console.log('Submitting updated session:', updatedSession);
    onEditSession(updatedSession);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
        <DialogHeader className="border-b border-slate-200 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent">
            Edit Demo Session
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8 py-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-sm font-medium text-slate-700">
                  Session Title *
                </Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., React Hooks Deep Dive"
                  required
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-technology" className="text-sm font-medium text-slate-700">
                  Technology *
                </Label>
                <Select value={formData.technology} onValueChange={(value) => handleInputChange('technology', value)}>
                  <SelectTrigger className="border-slate-200 focus:border-blue-500">
                    <SelectValue placeholder="Select Technology" />
                  </SelectTrigger>
                  <SelectContent>
                    {technologies.map((tech) => (
                      <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type" className="text-sm font-medium text-slate-700">
                  Session Type *
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="border-slate-200 focus:border-blue-500">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROJECT_BASED">Project Based</SelectItem>
                    <SelectItem value="PRODUCT_BASED">Product Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-difficulty" className="text-sm font-medium text-slate-700">
                  Difficulty Level *
                </Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                  <SelectTrigger className="border-slate-200 focus:border-blue-500">
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-sm font-medium text-slate-700">
                Description *
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what will be covered in this session..."
                rows={3}
                required
                className="border-slate-200 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Schedule & Location Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
              Schedule & Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date" className="text-sm font-medium text-slate-700">
                  Date *
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time" className="text-sm font-medium text-slate-700">
                  Time *
                </Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  required
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location" className="text-sm font-medium text-slate-700">
                  Location *
                </Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger className="border-slate-200 focus:border-blue-500">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration" className="text-sm font-medium text-slate-700">
                  Duration (minutes)
                </Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 90"
                  min="1"
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Capacity & Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
              Capacity & Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-maxAttendees" className="text-sm font-medium text-slate-700">
                  Max Attendees *
                </Label>
                <Input
                  id="edit-maxAttendees"
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                  placeholder="e.g., 20"
                  min="1"
                  max="100"
                  required
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-sm font-medium text-slate-700">
                  Status *
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="border-slate-200 focus:border-blue-500">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-createdBy" className="text-sm font-medium text-slate-700">
                  Created By
                </Label>
                <Input
                  id="edit-createdBy"
                  value={formData.createdBy}
                  onChange={(e) => handleInputChange('createdBy', e.target.value)}
                  placeholder="Creator name"
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Project Management Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
              Project Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sprintName" className="text-sm font-medium text-slate-700">
                  Sprint Name
                </Label>
                <Input
                  id="edit-sprintName"
                  value={formData.sprintName}
                  onChange={(e) => handleInputChange('sprintName', e.target.value)}
                  placeholder="e.g., Sprint 2024-01"
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-storyPoints" className="text-sm font-medium text-slate-700">
                  Story Points
                </Label>
                <Input
                  id="edit-storyPoints"
                  type="number"
                  value={formData.storyPoints}
                  onChange={(e) => handleInputChange('storyPoints', e.target.value)}
                  placeholder="e.g., 8"
                  min="0"
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-numberOfTasks" className="text-sm font-medium text-slate-700">
                  Number of Tasks
                </Label>
                <Input
                  id="edit-numberOfTasks"
                  type="number"
                  value={formData.numberOfTasks}
                  onChange={(e) => handleInputChange('numberOfTasks', e.target.value)}
                  placeholder="e.g., 12"
                  min="0"
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-numberOfBugs" className="text-sm font-medium text-slate-700">
                  Number of Bugs
                </Label>
                <Input
                  id="edit-numberOfBugs"
                  type="number"
                  value={formData.numberOfBugs}
                  onChange={(e) => handleInputChange('numberOfBugs', e.target.value)}
                  placeholder="e.g., 3"
                  min="0"
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Session Evaluation Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
              Session Evaluation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-rating" className="text-sm font-medium text-slate-700">
                  Session Rating (1-5)
                </Label>
                <Input
                  id="edit-rating"
                  type="number"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  placeholder="e.g., 4.5"
                  min="1"
                  max="5"
                  step="0.1"
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-currentStatus" className="text-sm font-medium text-slate-700">
                  Current Status
                </Label>
                <Select value={formData.currentStatus} onValueChange={(value) => handleInputChange('currentStatus', value)}>
                  <SelectTrigger className="border-slate-200 focus:border-blue-500">
                    <SelectValue placeholder="Select Current Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === 'In Progress' ? 'In Progress' : status === 'On Hold' ? 'On Hold' : status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
              Additional Information
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-prerequisites" className="text-sm font-medium text-slate-700">
                  Prerequisites
                </Label>
                <Textarea
                  id="edit-prerequisites"
                  value={formData.prerequisites}
                  onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                  placeholder="List any prerequisites for this session..."
                  rows={2}
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-feedback" className="text-sm font-medium text-slate-700">
                  Feedback
                </Label>
                <Textarea
                  id="edit-feedback"
                  value={formData.feedback}
                  onChange={(e) => handleInputChange('feedback', e.target.value)}
                  placeholder="Session feedback or notes..."
                  rows={3}
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="attendees">Current Attendees</Label>
              <Input
                id="attendees"
                type="number"
                min="0"
                value={formData.attendees}
                onChange={(e) => handleInputChange('attendees', e.target.value)}
                placeholder="Enter current attendees"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="px-6">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {loading ? 'Updating...' : 'Update Session'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
