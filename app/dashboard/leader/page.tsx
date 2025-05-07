'use client';
export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { 
  getSession, 
  getClubsByLeaderId, 
  createClub, 
  getFestivalsByOrganizerId,
  getClubById
} from '@/lib/localStorage';
import { Club, Festival, Session } from '@/types';
import { useAuthGuard } from '@/utils/authGuard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function LeaderDashboard() {
  useAuthGuard(['club_leader']);
  const router = useRouter();
  
  const [session, setSession] = useState<Session | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isCreatingClub, setIsCreatingClub] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<{
    name: string;
    description: string;
  }>();
  
  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.push('/auth/signin');
      return;
    }
    
    setSession(currentSession);
    refreshData(currentSession.userId);
  }, [router]);
  
  const refreshData = (userId: string) => {
    const userClubs = getClubsByLeaderId(userId);
    setClubs(userClubs);
    
    const userFestivals = getFestivalsByOrganizerId(userId);
    setFestivals(userFestivals);
  };
  
  const onSubmitClub = (data: { name: string; description: string }) => {
    if (!session) return;
    
    createClub({
      name: data.name,
      description: data.description,
      leaderId: session.userId,
    });
    
    setIsCreatingClub(false);
    reset();
    refreshData(session.userId);
  };
  
  if (!session) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Club Leader Dashboard</h1>
          <p className="text-muted-foreground">Manage your clubs and festivals</p>
        </div>
      </div>
      
      <div className="grid gap-8">
        {/* Clubs Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Your Clubs</h2>
            {!isCreatingClub && (
              <Button onClick={() => setIsCreatingClub(true)}>
                Create Club
              </Button>
            )}
          </div>
          
          {isCreatingClub && (
            <Card className="mb-6">
              <form onSubmit={handleSubmit(onSubmitClub)}>
                <CardHeader>
                  <CardTitle>Create New Club</CardTitle>
                  <CardDescription>Fill in the details to create your new club</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Club Name"
                    placeholder="Enter club name"
                    {...register('name', { required: 'Club name is required' })}
                    error={errors.name?.message}
                    fullWidth
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Describe your club"
                      {...register('description', { required: 'Description is required' })}
                    ></textarea>
                    {errors.description && (
                      <p className="text-sm text-destructive">{errors.description.message}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => {
                      setIsCreatingClub(false);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Club</Button>
                </CardFooter>
              </form>
            </Card>
          )}
          
          {clubs.length === 0 && !isCreatingClub ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-medium">No clubs yet</h3>
              <p className="text-muted-foreground mb-4">Create your first club to get started</p>
              <Button onClick={() => setIsCreatingClub(true)}>Create Club</Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clubs.map((club) => (
                <Card key={club.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="truncate">{club.name}</CardTitle>
                    <CardDescription>
                      {club.memberIds.length} member{club.memberIds.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{club.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="ghost" 
                      onClick={() => router.push(`/festivals/create?clubId=${club.id}`)}
                      className="w-full"
                    >
                      Create Festival
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
        
        {/* Festivals Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Your Festivals</h2>
          
          {festivals.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-medium">No festivals yet</h3>
              <p className="text-muted-foreground mb-4">
                {clubs.length > 0 
                  ? "Create a festival for one of your clubs"
                  : "Create a club first, then create a festival"}
              </p>
              {clubs.length > 0 && (
                <Button onClick={() => router.push(`/festivals/create?clubId=${clubs[0].id}`)}>
                  Create Festival
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {festivals.map((festival) => {
                const club = getClubById(festival.clubId);
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
                        {club?.name} • {new Date(festival.startDate).toLocaleDateString()} - {new Date(festival.endDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-2">{festival.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => router.push(`/festivals/${festival.id}`)}
                        className="w-full"
                      >
                        Manage
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}