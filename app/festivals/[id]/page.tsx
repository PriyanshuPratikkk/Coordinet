'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  getSession,
  getFestivalById,
  getSubEventsByFestivalId,
  getTasksByFestivalId,
  getExpensesByFestivalId,
  createSubEvent,
  createTask,
  createExpense,
  createParticipation,
  getParticipationsByUserId,
  getClubById
} from '@/lib/localStorage';
import { Festival, SubEvent, Task, Expense, Session } from '@/types';
import Button from '@/components/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/Card';
import Input from '@/components/Input';
import { useForm } from 'react-hook-form';

export default function FestivalPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [festival, setFestival] = useState<Festival | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLeader, setIsLeader] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [isCreatingSubEvent, setIsCreatingSubEvent] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isCreatingExpense, setIsCreatingExpense] = useState(false);
  
  // Forms
  const subEventForm = useForm<{
    name: string;
    description: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    location: string;
    maxParticipants: number;
  }>();
  
  const taskForm = useForm<{
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    assigneeId: string;
    dueDate: string;
  }>();
  
  const expenseForm = useForm<{
    title: string;
    amount: number;
    category: string;
    description: string;
    date: string;
  }>();

  useEffect(() => {
    const currentSession = getSession();
    setSession(currentSession);

    const fetchedFestival = getFestivalById(id);
    if (!fetchedFestival) {
      router.push('/');
      return;
    }
    
    setFestival(fetchedFestival);
    setSubEvents(getSubEventsByFestivalId(id));
    setTasks(getTasksByFestivalId(id));
    setExpenses(getExpensesByFestivalId(id));
    
    if (currentSession) {
      // Check if user is the organizer
      setIsLeader(fetchedFestival.organizerId === currentSession.userId);
      
      // Check if user is already registered
      const userParticipations = getParticipationsByUserId(currentSession.userId);
      setIsAlreadyRegistered(
        userParticipations.some(p => p.festivalId === id)
      );
    }
  }, [id, router]);

  if (!festival) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        Loading...
      </div>
    );
  }
  
  const club = getClubById(festival.clubId);
  
  const handleRegister = () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    try {
      createParticipation({
        userId: session.userId,
        festivalId: festival.id,
        status: 'registered',
        registrationDate: new Date().toISOString(),
      });
      
      setIsAlreadyRegistered(true);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  
  const handleCreateSubEvent = (data: any) => {
    if (!session || !isLeader) return;
    
    createSubEvent({
      festivalId: festival.id,
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      startTime: data.startTime,
      endDate: data.endDate,
      endTime: data.endTime,
      location: data.location,
      maxParticipants: data.maxParticipants,
    });
    
    setSubEvents(getSubEventsByFestivalId(id));
    setIsCreatingSubEvent(false);
    subEventForm.reset();
  };
  
  const handleCreateTask = (data: any) => {
    if (!session || !isLeader) return;
    
    createTask({
      title: data.title,
      description: data.description,
      status: data.status,
      assigneeId: data.assigneeId || session.userId,
      festivalId: festival.id,
      dueDate: data.dueDate,
    });
    
    setTasks(getTasksByFestivalId(id));
    setIsCreatingTask(false);
    taskForm.reset();
  };
  
  const handleCreateExpense = (data: any) => {
    if (!session || !isLeader) return;
    
    createExpense({
      title: data.title,
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: data.date,
      festivalId: festival.id,
      createdBy: session.userId,
    });
    
    setExpenses(getExpensesByFestivalId(id));
    setIsCreatingExpense(false);
    expenseForm.reset();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Festival Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold">{festival.name}</h1>
              <p className="text-muted-foreground">
                Organized by {club?.name} • {new Date(festival.startDate).toLocaleDateString()} - {new Date(festival.endDate).toLocaleDateString()}
              </p>
            </div>
            
            {session && !isLeader && !isAlreadyRegistered && (
              <Button onClick={handleRegister}>
                Register for Festival
              </Button>
            )}
            
            {isAlreadyRegistered && !isLeader && (
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Registered
              </div>
            )}
          </div>
          
          {/* Poster image if available */}
          {festival.poster && (
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-6">
              <img
                src={festival.poster}
                alt={`${festival.name} poster`}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
        
        {/* Tabs */}
        <div className="border-b mb-6">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'details' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('subevents')}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'subevents' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sub-Events
            </button>
            {isLeader && (
              <>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'tasks' 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'expenses' 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Expenses
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="space-y-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>About the Festival</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Description</h3>
                      <p className="text-muted-foreground">{festival.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Location</h3>
                      <p className="text-muted-foreground">{festival.location}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Date & Time</h3>
                      <p className="text-muted-foreground">
                        {new Date(festival.startDate).toLocaleDateString()} - {new Date(festival.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {festival.brochure && (
                      <div>
                        <h3 className="font-medium mb-1">Brochure</h3>
                        <a 
                          href={festival.brochure} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Download Brochure
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Sub-Events Tab */}
          {activeTab === 'subevents' && (
            <div>
              {isLeader && (
                <div className="mb-6 flex justify-end">
                  {!isCreatingSubEvent ? (
                    <Button onClick={() => setIsCreatingSubEvent(true)}>
                      Create Sub-Event
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsCreatingSubEvent(false);
                        subEventForm.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              )}
              
              {isCreatingSubEvent && (
                <Card className="mb-6">
                  <form onSubmit={subEventForm.handleSubmit(handleCreateSubEvent)}>
                    <CardHeader>
                      <CardTitle>Create Sub-Event</CardTitle>
                      <CardDescription>Add a new sub-event to your festival</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Input
                        label="Name"
                        placeholder="Enter sub-event name"
                        {...subEventForm.register('name', { required: 'Name is required' })}
                        error={subEventForm.formState.errors.name?.message}
                        fullWidth
                      />
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                          className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          placeholder="Describe the sub-event"
                          {...subEventForm.register('description', { required: 'Description is required' })}
                        ></textarea>
                        {subEventForm.formState.errors.description && (
                          <p className="text-sm text-destructive">{subEventForm.formState.errors.description.message}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Start Date"
                          type="date"
                          {...subEventForm.register('startDate', { required: 'Start date is required' })}
                          error={subEventForm.formState.errors.startDate?.message}
                          fullWidth
                        />
                        
                        <Input
                          label="Start Time"
                          type="time"
                          {...subEventForm.register('startTime', { required: 'Start time is required' })}
                          error={subEventForm.formState.errors.startTime?.message}
                          fullWidth
                        />
                        
                        <Input
                          label="End Date"
                          type="date"
                          {...subEventForm.register('endDate', { required: 'End date is required' })}
                          error={subEventForm.formState.errors.endDate?.message}
                          fullWidth
                        />
                        
                        <Input
                          label="End Time"
                          type="time"
                          {...subEventForm.register('endTime', { required: 'End time is required' })}
                          error={subEventForm.formState.errors.endTime?.message}
                          fullWidth
                        />
                      </div>
                      
                      <Input
                        label="Location"
                        placeholder="Enter location"
                        {...subEventForm.register('location', { required: 'Location is required' })}
                        error={subEventForm.formState.errors.location?.message}
                        fullWidth
                      />
                      
                      <Input
                        label="Max Participants"
                        type="number"
                        min="1"
                        {...subEventForm.register('maxParticipants', { 
                          required: 'Maximum participants is required',
                          valueAsNumber: true,
                          min: {
                            value: 1,
                            message: 'Must have at least 1 participant'
                          }
                        })}
                        error={subEventForm.formState.errors.maxParticipants?.message}
                        fullWidth
                      />
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => {
                          setIsCreatingSubEvent(false);
                          subEventForm.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Create Sub-Event</Button>
                    </CardFooter>
                  </form>
                </Card>
              )}
              
              {subEvents.length === 0 && !isCreatingSubEvent ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium">No sub-events</h3>
                  <p className="text-muted-foreground mb-4">
                    {isLeader 
                      ? "Create sub-events to break down your festival into smaller activities"
                      : "There are no sub-events for this festival yet"}
                  </p>
                  {isLeader && (
                    <Button onClick={() => setIsCreatingSubEvent(true)}>
                      Create Sub-Event
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {subEvents.map((subEvent) => (
                    <Card key={subEvent.id}>
                      <CardHeader>
                        <CardTitle>{subEvent.name}</CardTitle>
                        <CardDescription>
                          {new Date(subEvent.startDate).toLocaleDateString()} • {subEvent.startTime}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{subEvent.description}</p>
                        <div className="space-y-1 text-sm">
                          <p className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>{subEvent.location}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-muted-foreground">Max Participants:</span>
                            <span>{subEvent.maxParticipants}</span>
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline"
                          onClick={() => router.push(`/subevents/${subEvent.id}`)}
                          className="w-full"
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Tasks Tab (Leader Only) */}
          {activeTab === 'tasks' && isLeader && (
            <div>
              <div className="mb-6 flex justify-end">
                {!isCreatingTask ? (
                  <Button onClick={() => setIsCreatingTask(true)}>
                    Create Task
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreatingTask(false);
                      taskForm.reset();
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
              
              {isCreatingTask && (
                <Card className="mb-6">
                  <form onSubmit={taskForm.handleSubmit(handleCreateTask)}>
                    <CardHeader>
                      <CardTitle>Create Task</CardTitle>
                      <CardDescription>Add a new task for the festival</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Input
                        label="Title"
                        placeholder="Enter task title"
                        {...taskForm.register('title', { required: 'Title is required' })}
                        error={taskForm.formState.errors.title?.message}
                        fullWidth
                      />
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                          className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          placeholder="Describe the task"
                          {...taskForm.register('description')}
                        ></textarea>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select
                          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          {...taskForm.register('status', { required: 'Status is required' })}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        {taskForm.formState.errors.status && (
                          <p className="text-sm text-destructive">{taskForm.formState.errors.status.message}</p>
                        )}
                      </div>
                      
                      <Input
                        label="Assignee ID"
                        placeholder="Enter assignee ID (leave blank to assign to yourself)"
                        {...taskForm.register('assigneeId')}
                        fullWidth
                      />
                      
                      <Input
                        label="Due Date"
                        type="date"
                        {...taskForm.register('dueDate', { required: 'Due date is required' })}
                        error={taskForm.formState.errors.dueDate?.message}
                        fullWidth
                      />
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => {
                          setIsCreatingTask(false);
                          taskForm.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Create Task</Button>
                    </CardFooter>
                  </form>
                </Card>
              )}
              
              {tasks.length === 0 && !isCreatingTask ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium">No tasks</h3>
                  <p className="text-muted-foreground mb-4">
                    Create tasks to help organize your festival
                  </p>
                  <Button onClick={() => setIsCreatingTask(true)}>
                    Create Task
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {tasks.map((task) => (
                    <Card key={task.id}>
                      <CardHeader className="flex flex-row items-start justify-between space-y-0">
                        <div>
                          <CardTitle>{task.title}</CardTitle>
                          <CardDescription>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : task.status === 'in_progress' 
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.status === 'in_progress' ? 'In Progress' : 
                           task.status === 'completed' ? 'Completed' : 'Pending'}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{task.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Expenses Tab (Leader Only) */}
          {activeTab === 'expenses' && isLeader && (
            <div>
              <div className="mb-6 flex justify-end">
                {!isCreatingExpense ? (
                  <Button onClick={() => setIsCreatingExpense(true)}>
                    Add Expense
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreatingExpense(false);
                      expenseForm.reset();
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
              
              {isCreatingExpense && (
                <Card className="mb-6">
                  <form onSubmit={expenseForm.handleSubmit(handleCreateExpense)}>
                    <CardHeader>
                      <CardTitle>Add Expense</CardTitle>
                      <CardDescription>Record a new expense for the festival</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Input
                        label="Title"
                        placeholder="Enter expense title"
                        {...expenseForm.register('title', { required: 'Title is required' })}
                        error={expenseForm.formState.errors.title?.message}
                        fullWidth
                      />
                      
                      <Input
                        label="Amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...expenseForm.register('amount', { 
                          required: 'Amount is required',
                          valueAsNumber: true,
                          min: {
                            value: 0,
                            message: 'Amount must be positive'
                          }
                        })}
                        error={expenseForm.formState.errors.amount?.message}
                        fullWidth
                      />
                      
                      <Input
                        label="Category"
                        placeholder="Enter expense category"
                        {...expenseForm.register('category', { required: 'Category is required' })}
                        error={expenseForm.formState.errors.category?.message}
                        fullWidth
                      />
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                          className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          placeholder="Describe the expense"
                          {...expenseForm.register('description')}
                        ></textarea>
                      </div>
                      
                      <Input
                        label="Date"
                        type="date"
                        {...expenseForm.register('date', { required: 'Date is required' })}
                        error={expenseForm.formState.errors.date?.message}
                        fullWidth
                      />
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => {
                          setIsCreatingExpense(false);
                          expenseForm.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Add Expense</Button>
                    </CardFooter>
                  </form>
                </Card>
              )}
              
              {expenses.length === 0 && !isCreatingExpense ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium">No expenses</h3>
                  <p className="text-muted-foreground mb-4">
                    Add expenses to track spending for your festival
                  </p>
                  <Button onClick={() => setIsCreatingExpense(true)}>
                    Add Expense
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">
                      Total Expenses: ${expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
                    </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="text-left p-3">Title</th>
                          <th className="text-left p-3">Category</th>
                          <th className="text-left p-3">Date</th>
                          <th className="text-right p-3">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((expense) => (
                          <tr key={expense.id} className="border-b">
                            <td className="p-3">{expense.title}</td>
                            <td className="p-3">{expense.category}</td>
                            <td className="p-3">{new Date(expense.date).toLocaleDateString()}</td>
                            <td className="p-3 text-right">₹{expense.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}