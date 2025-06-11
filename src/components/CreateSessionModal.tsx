import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MapPin, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sessionData: any) => void;
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

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: '',
    technology: '',
    date: '',
    time: '',
    description: '',
    location: '',
    maxAttendees: '',
    attendees: '0',
    difficulty: '',
    prerequisites: '',
    duration: '',
    createdBy: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.technology) newErrors.technology = 'Technology is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.maxAttendees || parseInt(formData.maxAttendees) < 1) {
      newErrors.maxAttendees = 'Valid max attendees is required';
    }
    if (!formData.difficulty) newErrors.difficulty = 'Difficulty level is required';
    if (!formData.createdBy.trim()) newErrors.createdBy = 'Creator name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the form
    onSubmit({
      ...formData,
      maxAttendees: parseInt(formData.maxAttendees),
      attendees: parseInt(formData.attendees),
      status: 'upcoming'
    });

    // Reset form
    setFormData({
      title: '',
      technology: '',
      date: '',
      time: '',
      description: '',
      location: '',
      maxAttendees: '',
      attendees: '0',
      difficulty: '',
      prerequisites: '',
      duration: '',
      createdBy: ''
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-blue-600" />
            Create New Demo Session
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center mb-3">
              <BookOpen className="h-5 w-5 mr-2 text-gray-600" />
              <h3 className="text-lg font-medium">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Session Title *</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., React Hooks Deep Dive"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="technology">Technology *</Label>
                <Select value={formData.technology} onValueChange={(value) => handleInputChange('technology', value)}>
                  <SelectTrigger className={errors.technology ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select Technology" />
                  </SelectTrigger>
                  <SelectContent>
                    {technologies.map((tech) => (
                      <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.technology && <p className="text-red-500 text-sm mt-1">{errors.technology}</p>}
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty Level *</Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                  <SelectTrigger className={errors.difficulty ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                {errors.difficulty && <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what will be covered in this session..."
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Input
                id="prerequisites"
                type="text"
                value={formData.prerequisites}
                onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                placeholder="e.g., Basic JavaScript knowledge"
              />
            </div>
          </div>

          {/* Schedule & Location */}
          <div className="space-y-4">
            <div className="flex items-center mb-3">
              <Clock className="h-5 w-5 mr-2 text-gray-600" />
              <h3 className="text-lg font-medium">Schedule & Location</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>
              
              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className={errors.time ? 'border-red-500' : ''}
                />
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 90"
                  min="15"
                  max="480"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger className={errors.location ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <Label htmlFor="maxAttendees">Max Attendees *</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                  placeholder="e.g., 20"
                  min="1"
                  max="100"
                  className={errors.maxAttendees ? 'border-red-500' : ''}
                />
                {errors.maxAttendees && <p className="text-red-500 text-sm mt-1">{errors.maxAttendees}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="createdBy">Created By *</Label>
                <Input
                  id="createdBy"
                  type="text"
                  value={formData.createdBy}
                  onChange={(e) => handleInputChange('createdBy', e.target.value)}
                  placeholder="Enter creator name"
                  className={errors.createdBy ? 'border-red-500' : ''}
                />
                {errors.createdBy && <p className="text-red-500 text-sm mt-1">{errors.createdBy}</p>}
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
                  className={errors.attendees ? 'border-red-500' : ''}
                />
                {errors.attendees && <p className="text-red-500 text-sm mt-1">{errors.attendees}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Session
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
