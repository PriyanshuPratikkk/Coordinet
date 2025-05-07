'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { getUserByEmail, setSession } from '@/lib/localStorage';
import Input from '@/components/Input';
import Button from '@/components/Button';

type SigninFormData = {
  email: string;
  password: string;
};

export default function SigninPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { 
    register, 
    handleSubmit,
    formState: { errors } 
  } = useForm<SigninFormData>();
  
  const onSubmit = async (data: SigninFormData) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      // Check if user exists
      const user = getUserByEmail(data.email);
      if (!user) {
        setError('Invalid email or password');
        return;
      }
      
      // Check password
      if (user.password !== data.password) {
        setError('Invalid email or password');
        return;
      }
      
      // Set session
      setSession({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      
      // Redirect to dashboard
      router.push(user.role === 'club_leader' ? '/dashboard/leader' : '/dashboard/student');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold">Sign in to your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link 
              href="/auth/signup" 
              className="font-medium text-primary hover:text-primary/90"
            >
              Sign up
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Email address"
              id="email"
              type="email"
              autoComplete="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={errors.email?.message}
              fullWidth
            />
            
            <Input
              label="Password"
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password', { 
                required: 'Password is required',
              })}
              error={errors.password?.message}
              fullWidth
            />
          </div>
          
          <Button
            type="submit"
            isLoading={isSubmitting}
            fullWidth
            size="lg"
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}