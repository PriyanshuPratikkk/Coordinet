'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { 
  getSession, 
  getClubById, 
  createFestival 
} from '@/lib/localStorage';
import { fileToBase64 } from '@/utils/fileToBase64';
import { useAuthGuard } from '@/utils/authGuard';
import { Festival } from '@/types';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';

type FestivalFormData = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  poster: FileList;
  brochure: FileList;
};

export default function CreateFestivalPage() {
  useAuthGuard(['club_leader']);
  const router = useRouter();
  const searchParams = useSearchParams();
  const clubId = searchParams.get('clubId');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<FestivalFormData>();
  
  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    if (!clubId) {
      router.push('/dashboard/leader');
      return;
    }
    
    const club = getClubById(clubId);
    if (!club || club.leaderId !== session.userId) {
      router.push('/dashboard/leader');
      return;
    }
  }, [clubId, router]);
  
  const posterFile = watch('poster');
  const brochureFile = watch('brochure');
  
  const onSubmit = async (data: FestivalFormData) => {
    if (!clubId) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const session = getSession();
      if (!session) {
        router.push('/auth/signin');
        return;
      }
      
      let posterBase64 = '';
      let brochureBase64 = '';
      
      // Convert files to Base64 if provided
      if (data.poster && data.poster.length > 0) {
        posterBase64 = await fileToBase64(data.poster[0]);
      }
      
      if (data.brochure && data.brochure.length > 0) {
        brochureBase64 = await fileToBase64(data.brochure[0]);
      }
      
      // Create festival
      const festival = createFestival({
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        poster: posterBase64,
        brochure: brochureBase64,
        organizerId: session.userId,
        clubId,
      });
      
      // Redirect to festival page
      router.push(`/festivals/${festival.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the festival');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Festival</h1>
          <p className="text-muted-foreground">Add details about your upcoming festival</p>
        </div>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-md text-sm mb-6">
            {error}
          </div>
        )}
        
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Festival Details</CardTitle>
              <CardDescription>Fill out the information below to create your festival</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Festival Name"
                placeholder="Enter festival name"
                {...register('name', { required: 'Festival name is required' })}
                error={errors.name?.message}
                fullWidth
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Describe your festival"
                  {...register('description', { required: 'Description is required' })}
                ></textarea>
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  {...register('startDate', { required: 'Start date is required' })}
                  error={errors.startDate?.message}
                  fullWidth
                />
                
                <Input
                  label="End Date"
                  type="date"
                  {...register('endDate', { required: 'End date is required' })}
                  error={errors.endDate?.message}
                  fullWidth
                />
              </div>
              
              <Input
                label="Location"
                placeholder="Enter festival location"
                {...register('location', { required: 'Location is required' })}
                error={errors.location?.message}
                fullWidth
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Poster Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full cursor-pointer rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('poster')}
                />
                {posterFile && posterFile.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Selected file: {posterFile[0].name}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Brochure PDF (Optional)</label>
                <input
                  type="file"
                  accept=".pdf"
                  className="w-full cursor-pointer rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('brochure')}
                />
                {brochureFile && brochureFile.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Selected file: {brochureFile[0].name}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/leader')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Create Festival
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}