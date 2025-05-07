'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  getSession,
  getSubEventById,
  getFestivalById,
  createParticipation,
  getParticipationsByUserId,
  getParticipationsBySubEventId
} from '@/lib/localStorage';
import { Festival, SubEvent, Session, User, Participation } from '@/types';
import Button from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';

export default function SubEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [subEvent, setSubEvent] = useState<SubEvent | null>(null);
  const [festival, setFestival] = useState<Festival | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLeader, setIsLeader] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [remainingSpots, setRemainingSpots] = useState(0);

  useEffect(() => {
    const currentSession = getSession();
    setSession(currentSession);

    const fetchedSubEvent = getSubEventById(id);
    if (!fetchedSubEvent) {
      router.push('/');
      return;
    }
    
    setSubEvent(fetchedSubEvent);
    
    const fetchedFestival = getFestivalById(fetchedSubEvent.festivalId);
    if (fetchedFestival) {
      setFestival(fetchedFestival);
      
      if (currentSession) {
        // Check if user is the organizer
        setIsLeader(fetchedFestival.organizerId === currentSession.userId);
        
        // Check if user is already registered
        const userParticipations = getParticipationsByUserId(currentSession.userId);
        setIsAlreadyRegistered(
          userParticipations.some(p => p.subEventId === id)
        );
      }
    }
    
    // Get all participations for this subevent
    const subEventParticipations = getParticipationsBySubEventId(id);
    setParticipations(subEventParticipations);
    
    // Calculate remaining spots
    setRemainingSpots(fetchedSubEvent.maxParticipants - subEventParticipations.length);
  }, [id, router]);

  if (!subEvent || !festival) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        Loading...
      </div>
    );
  }
  
  const handleRegister = () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    if (remainingSpots <= 0) {
      alert('This sub-event is already full.');
      return;
    }
    
    try {
      createParticipation({
        userName: session.name,
        userId: session.userId,
        festivalId: festival.id,
        subEventId: subEvent.id,
        status: 'registered',
        registrationDate: new Date().toISOString(),
      });
      
      setIsAlreadyRegistered(true);
      setParticipations([...participations, {
        id: 'temp-id',
        userName: session.name,
        userId: session.userId,
        festivalId: festival.id,
        subEventId: subEvent.id,
        status: 'registered',
        registrationDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }]);
      setRemainingSpots(prev => prev - 1);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/festivals/${festival.id}`)}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to {festival.name}
          </button>
        </div>
        
        {/* SubEvent Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold">{subEvent.name}</h1>
              <p className="text-muted-foreground">
                Part of {festival.name} • {new Date(subEvent.startDate).toLocaleDateString()} {subEvent.startTime}
              </p>
            </div>
            
            {session && !isLeader && !isAlreadyRegistered && (
              <Button 
                onClick={handleRegister}
                disabled={remainingSpots <= 0}
              >
                {remainingSpots > 0 ? 'Register' : 'Fully Booked'}
              </Button>
            )}
            
            {isAlreadyRegistered && !isLeader && (
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Registered
              </div>
            )}
          </div>
        </div>
        
        {/* SubEvent Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About this sub-event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Description</h3>
              <p className="text-muted-foreground">{subEvent.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-1">Date & Time</h3>
                <p className="text-muted-foreground">
                  {new Date(subEvent.startDate).toLocaleDateString()} {subEvent.startTime} - 
                  {subEvent.startDate !== subEvent.endDate && (
                    ` ${new Date(subEvent.endDate).toLocaleDateString()} `
                  )}
                  {subEvent.endTime}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Location</h3>
                <p className="text-muted-foreground">{subEvent.location}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Capacity</h3>
              <p className="text-muted-foreground">
                {participations.length} / {subEvent.maxParticipants} participants
                {remainingSpots <= 5 && remainingSpots > 0 && (
                  <span className="text-amber-600 ml-2">Only {remainingSpots} spots left!</span>
                )}
                {remainingSpots <= 0 && (
                  <span className="text-destructive ml-2">Fully booked</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Registration CTA for student */}
        {session && !isLeader && !isAlreadyRegistered && remainingSpots > 0 && (
          <div className="bg-muted p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-2">Join this event</h2>
            <p className="text-muted-foreground mb-4">
              {remainingSpots} spots remaining out of {subEvent.maxParticipants}
            </p>
            <Button onClick={handleRegister}>Register Now</Button>
          </div>
        )}
        
        {/* Participants list for organizer */}
        {isLeader && (
          <Card>
            <CardHeader>
              <CardTitle>Participants ({participations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {participations.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No participants have registered yet
                </p>
              ) : (
                <div className="space-y-2">
                  {participations.map((participation) => (
                    <div 
                      key={participation.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{participation.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          Registered on {new Date(participation.registrationDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        participation.status === 'attended' 
                          ? 'bg-green-100 text-green-800' 
                          : participation.status === 'cancelled' 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {participation.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}