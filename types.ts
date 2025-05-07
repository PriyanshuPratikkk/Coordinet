export interface User {
  id: string;
  email: string;
  password: string; // In a real app, never store plain passwords
  name: string;
  role: 'club_leader' | 'student';
  createdAt: string;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: 'club_leader' | 'student';
}

export interface Club {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Festival {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizerId: string;
  clubId: string;
  poster: string; // Base64 encoded image
  brochure: string; // Base64 encoded PDF
  createdAt: string;
  updatedAt: string;
}

export interface SubEvent {
  id: string;
  festivalId: string;
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  maxParticipants: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  assigneeId: string;
  festivalId: string;
  subEventId?: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  festivalId: string;
  subEventId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Participation {
  id: string;
  userName: string;
  userId: string;
  festivalId: string;
  subEventId?: string;
  status: 'registered' | 'attended' | 'cancelled';
  registrationDate: string;
  createdAt: string;
}