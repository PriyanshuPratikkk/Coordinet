'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  getSession, 
  getFestivals, 
  getParticipationsByUserId,
  getFestivalById,
  getSubEventById
} from '@/lib/localStorage';
import { Festival, Participation, Session, SubEvent } from '@/types';
import { useAuthGuard } from '@/utils/authGuard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/Card';
import Button from '@/components/Button';

export default function StudentDashboard() {
  useAuthGuard(['student']);
  const router = useRouter();
  
  const [session, setSession] = useState<Session | null>(null);
  const [upcomingFestivals, setUpcomingFestivals] = useState<Festival[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [participatedFestivals, setParticipatedFestivals] = useState<Festival[] | SubEvent[]>([]);
  
  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.push('/auth/signin');
      return;
    }
    
    setSession(currentSession);
    
    // Get all festivals where the end date is in the future
    const now = new Date();
    const allFestivals = getFestivals();
    const upcoming = allFestivals.filter(
      festival => new Date(festival.endDate) >= now
    ).sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    setUpcomingFestivals(upcoming);
    
    // Get user participations
    const userParticipations = getParticipationsByUserId(currentSession.userId);
    setParticipations(userParticipations);
    
    // Get festivals the user has participated in
    const festivals = userParticipations.map(
      participation => getFestivalById(participation.festivalId)
    ).filter(Boolean) as Festival[];

    const subEvents = userParticipations.map(
      participation => getSubEventById(participation.subEventId || "")
    ).filter(Boolean) as SubEvent[];

    // console.log(subEvents)
    
    setParticipatedFestivals(subEvents);
  }, [router]);
  
  if (!session) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">Discover and participate in festivals</p>
      </div>
      
      <div className="grid gap-8">
        {/* Upcoming Festivals Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Festivals</h2>
          
          {upcomingFestivals.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-medium">No upcoming festivals</h3>
              <p className="text-muted-foreground">Check back later for new events</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingFestivals.map((festival) => {
                const hasRegistered = participations.some(p => p.festivalId === festival.id);
                
                return (
                  <Card key={festival.id} className="transition-all hover:shadow-md">
                    <div 
                      className="h-32 bg-muted rounded-t-lg overflow-hidden relative"
                      style={{
                        backgroundImage: festival.poster ? `url(${festival.poster})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <CardHeader>
                      <CardTitle className="truncate">{festival.name}</CardTitle>
                      <CardDescription>
                        {new Date(festival.startDate).toLocaleDateString()} - {new Date(festival.endDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-2">{festival.description}</p>
                      <p className="text-sm mt-2 text-muted-foreground">{festival.location}</p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant={hasRegistered ? 'outline' : 'default'}
                        onClick={() => router.push(`/festivals/${festival.id}`)}
                        className="w-full"
                      >
                        {hasRegistered ? 'View Details' : 'Register'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
        
        {/* Your Participations Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Your Participations</h2>
          
          {participatedFestivals.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-medium">No participations yet</h3>
              <p className="text-muted-foreground">Register for festivals to see them here</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {participatedFestivals.map((festival) => (
                <Card key={festival.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="truncate">{festival.name}</CardTitle>
                    <CardDescription>
                      {new Date(festival.startDate).toLocaleDateString()} - {new Date(festival.endDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2">{festival.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      onClick={() => router.push(`/subevents/${festival.id}`)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}