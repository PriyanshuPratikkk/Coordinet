import { 
  User, 
  Session, 
  Club, 
  Festival, 
  SubEvent, 
  Task, 
  Expense, 
  Participation 
} from '@/types';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'coordinet_users',
  SESSION: 'coordinet_session',
  CLUBS: 'coordinet_clubs',
  FESTIVALS: 'coordinet_festivals',
  SUBEVENTS: 'coordinet_subevents',
  TASKS: 'coordinet_tasks',
  EXPENSES: 'coordinet_expenses',
  PARTICIPATIONS: 'coordinet_participations',
};

// Helper functions for localStorage
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// User management
export function getUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.USERS, []);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(user => user.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(user => user.email === email);
}

export function createUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const users = getUsers();
  const existingUser = users.find(u => u.email === user.email);
  
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  const newUser: User = {
    ...user,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  setItem(STORAGE_KEYS.USERS, [...users, newUser]);
  return newUser;
}

// Session management
export function getSession(): Session | null {
  return getItem<Session | null>(STORAGE_KEYS.SESSION, null);
}

export function setSession(session: Session): void {
  setItem(STORAGE_KEYS.SESSION, session);
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

// Club management
export function getClubs(): Club[] {
  return getItem<Club[]>(STORAGE_KEYS.CLUBS, []);
}

export function getClubById(id: string): Club | undefined {
  return getClubs().find(club => club.id === id);
}

export function getClubsByLeaderId(leaderId: string): Club[] {
  return getClubs().filter(club => club.leaderId === leaderId);
}

export function createClub(club: Omit<Club, 'id' | 'createdAt' | 'updatedAt' | 'memberIds'>): Club {
  const clubs = getClubs();
  
  const newClub: Club = {
    ...club,
    id: crypto.randomUUID(),
    memberIds: [club.leaderId],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  setItem(STORAGE_KEYS.CLUBS, [...clubs, newClub]);
  return newClub;
}

export function updateClub(id: string, clubData: Partial<Omit<Club, 'id' | 'createdAt' | 'updatedAt'>>): Club {
  const clubs = getClubs();
  const clubIndex = clubs.findIndex(club => club.id === id);
  
  if (clubIndex === -1) {
    throw new Error('Club not found');
  }
  
  const updatedClub: Club = {
    ...clubs[clubIndex],
    ...clubData,
    updatedAt: new Date().toISOString(),
  };
  
  clubs[clubIndex] = updatedClub;
  setItem(STORAGE_KEYS.CLUBS, clubs);
  
  return updatedClub;
}

export function deleteClub(id: string): void {
  const clubs = getClubs();
  setItem(STORAGE_KEYS.CLUBS, clubs.filter(club => club.id !== id));
}

// Festival management
export function getFestivals(): Festival[] {
  return getItem<Festival[]>(STORAGE_KEYS.FESTIVALS, []);
}

export function getFestivalById(id: string): Festival | undefined {
  return getFestivals().find(festival => festival.id === id);
}

export function getFestivalsByClubId(clubId: string): Festival[] {
  return getFestivals().filter(festival => festival.clubId === clubId);
}

export function getFestivalsByOrganizerId(organizerId: string): Festival[] {
  return getFestivals().filter(festival => festival.organizerId === organizerId);
}

export function createFestival(festival: Omit<Festival, 'id' | 'createdAt' | 'updatedAt'>): Festival {
  const festivals = getFestivals();
  
  const newFestival: Festival = {
    ...festival,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  setItem(STORAGE_KEYS.FESTIVALS, [...festivals, newFestival]);
  return newFestival;
}

export function updateFestival(id: string, festivalData: Partial<Omit<Festival, 'id' | 'createdAt' | 'updatedAt'>>): Festival {
  const festivals = getFestivals();
  const festivalIndex = festivals.findIndex(festival => festival.id === id);
  
  if (festivalIndex === -1) {
    throw new Error('Festival not found');
  }
  
  const updatedFestival: Festival = {
    ...festivals[festivalIndex],
    ...festivalData,
    updatedAt: new Date().toISOString(),
  };
  
  festivals[festivalIndex] = updatedFestival;
  setItem(STORAGE_KEYS.FESTIVALS, festivals);
  
  return updatedFestival;
}

export function deleteFestival(id: string): void {
  const festivals = getFestivals();
  setItem(STORAGE_KEYS.FESTIVALS, festivals.filter(festival => festival.id !== id));
}

// SubEvent management
export function getSubEvents(): SubEvent[] {
  return getItem<SubEvent[]>(STORAGE_KEYS.SUBEVENTS, []);
}

export function getSubEventById(id: string): SubEvent | undefined {
  return getSubEvents().find(subEvent => subEvent.id === id);
}

export function getSubEventsByFestivalId(festivalId: string): SubEvent[] {
  return getSubEvents().filter(subEvent => subEvent.festivalId === festivalId);
}

export function createSubEvent(subEvent: Omit<SubEvent, 'id' | 'createdAt' | 'updatedAt'>): SubEvent {
  const subEvents = getSubEvents();
  
  const newSubEvent: SubEvent = {
    ...subEvent,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  setItem(STORAGE_KEYS.SUBEVENTS, [...subEvents, newSubEvent]);
  return newSubEvent;
}

export function updateSubEvent(id: string, subEventData: Partial<Omit<SubEvent, 'id' | 'createdAt' | 'updatedAt'>>): SubEvent {
  const subEvents = getSubEvents();
  const subEventIndex = subEvents.findIndex(subEvent => subEvent.id === id);
  
  if (subEventIndex === -1) {
    throw new Error('SubEvent not found');
  }
  
  const updatedSubEvent: SubEvent = {
    ...subEvents[subEventIndex],
    ...subEventData,
    updatedAt: new Date().toISOString(),
  };
  
  subEvents[subEventIndex] = updatedSubEvent;
  setItem(STORAGE_KEYS.SUBEVENTS, subEvents);
  
  return updatedSubEvent;
}

export function deleteSubEvent(id: string): void {
  const subEvents = getSubEvents();
  setItem(STORAGE_KEYS.SUBEVENTS, subEvents.filter(subEvent => subEvent.id !== id));
}

// Task management
export function getTasks(): Task[] {
  return getItem<Task[]>(STORAGE_KEYS.TASKS, []);
}

export function getTaskById(id: string): Task | undefined {
  return getTasks().find(task => task.id === id);
}

export function getTasksByFestivalId(festivalId: string): Task[] {
  return getTasks().filter(task => task.festivalId === festivalId);
}

export function getTasksBySubEventId(subEventId: string): Task[] {
  return getTasks().filter(task => task.subEventId === subEventId);
}

export function getTasksByAssigneeId(assigneeId: string): Task[] {
  return getTasks().filter(task => task.assigneeId === assigneeId);
}

export function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
  const tasks = getTasks();
  
  const newTask: Task = {
    ...task,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  setItem(STORAGE_KEYS.TASKS, [...tasks, newTask]);
  return newTask;
}

export function updateTask(id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Task {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  
  const updatedTask: Task = {
    ...tasks[taskIndex],
    ...taskData,
    updatedAt: new Date().toISOString(),
  };
  
  tasks[taskIndex] = updatedTask;
  setItem(STORAGE_KEYS.TASKS, tasks);
  
  return updatedTask;
}

export function deleteTask(id: string): void {
  const tasks = getTasks();
  setItem(STORAGE_KEYS.TASKS, tasks.filter(task => task.id !== id));
}

// Expense management
export function getExpenses(): Expense[] {
  return getItem<Expense[]>(STORAGE_KEYS.EXPENSES, []);
}

export function getExpenseById(id: string): Expense | undefined {
  return getExpenses().find(expense => expense.id === id);
}

export function getExpensesByFestivalId(festivalId: string): Expense[] {
  return getExpenses().filter(expense => expense.festivalId === festivalId);
}

export function getExpensesBySubEventId(subEventId: string): Expense[] {
  return getExpenses().filter(expense => expense.subEventId === subEventId);
}

export function createExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Expense {
  const expenses = getExpenses();
  
  const newExpense: Expense = {
    ...expense,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  setItem(STORAGE_KEYS.EXPENSES, [...expenses, newExpense]);
  return newExpense;
}

export function updateExpense(id: string, expenseData: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>): Expense {
  const expenses = getExpenses();
  const expenseIndex = expenses.findIndex(expense => expense.id === id);
  
  if (expenseIndex === -1) {
    throw new Error('Expense not found');
  }
  
  const updatedExpense: Expense = {
    ...expenses[expenseIndex],
    ...expenseData,
    updatedAt: new Date().toISOString(),
  };
  
  expenses[expenseIndex] = updatedExpense;
  setItem(STORAGE_KEYS.EXPENSES, expenses);
  
  return updatedExpense;
}

export function deleteExpense(id: string): void {
  const expenses = getExpenses();
  setItem(STORAGE_KEYS.EXPENSES, expenses.filter(expense => expense.id !== id));
}

// Participation management
export function getParticipations(): Participation[] {
  return getItem<Participation[]>(STORAGE_KEYS.PARTICIPATIONS, []);
}

export function getParticipationById(id: string): Participation | undefined {
  return getParticipations().find(participation => participation.id === id);
}

export function getParticipationsByUserId(userId: string): Participation[] {
  return getParticipations().filter(participation => participation.userId === userId);
}

export function getParticipationsByFestivalId(festivalId: string): Participation[] {
  return getParticipations().filter(participation => participation.festivalId === festivalId);
}

export function getParticipationsBySubEventId(subEventId: string): Participation[] {
  return getParticipations().filter(participation => participation.subEventId === subEventId);
}

export function createParticipation(participation: Omit<Participation, 'id' | 'createdAt'>): Participation {
  const participations = getParticipations();
  
  // Check if the user is already participating in this event
  const existingParticipation = participations.find(
    p => p.userId === participation.userId && 
    p.festivalId === participation.festivalId && 
    p.subEventId === participation.subEventId
  );
  
  if (existingParticipation) {
    throw new Error('User is already participating in this event');
  }
  
  const newParticipation: Participation = {
    ...participation,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  setItem(STORAGE_KEYS.PARTICIPATIONS, [...participations, newParticipation]);
  return newParticipation;
}

export function updateParticipation(id: string, participationData: Partial<Omit<Participation, 'id' | 'createdAt'>>): Participation {
  const participations = getParticipations();
  const participationIndex = participations.findIndex(participation => participation.id === id);
  
  if (participationIndex === -1) {
    throw new Error('Participation not found');
  }
  
  const updatedParticipation: Participation = {
    ...participations[participationIndex],
    ...participationData,
  };
  
  participations[participationIndex] = updatedParticipation;
  setItem(STORAGE_KEYS.PARTICIPATIONS, participations);
  
  return updatedParticipation;
}

export function deleteParticipation(id: string): void {
  const participations = getParticipations();
  setItem(STORAGE_KEYS.PARTICIPATIONS, participations.filter(participation => participation.id !== id));
}