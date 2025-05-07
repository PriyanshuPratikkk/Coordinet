'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { createUser, getUserByEmail, setSession } from '@/lib/localStorage';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { User } from '@/types';

type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'club_leader' | 'student';
};

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<SignupFormData>({
    defaultValues: {
      role: 'student'
    }
  });
  
  const password = watch('password');
  
  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      // Check if user with email already exists
      const existingUser = getUserByEmail(data.email);
      if (existingUser) {
        setError('A user with this email already exists');
        return;
      }
      
      // Create user
      const user = createUser({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      });
      
      // Set session
      setSession({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      
      // Redirect to dashboard
      router.push(data.role === 'club_leader' ? '/dashboard/leader' : '/dashboard/student');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link 
              href="/auth/signin" 
              className="font-medium text-primary hover:text-primary/90"
            >
              Sign in
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
              label="Full Name"
              id="name"
              autoComplete="name"
              {...register('name', { 
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              error={errors.name?.message}
              fullWidth
            />
            
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
              autoComplete="new-password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={errors.password?.message}
              fullWidth
            />
            
            <Input
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              error={errors.confirmPassword?.message}
              fullWidth
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-muted">
                  <input
                    type="radio"
                    className="mr-2"
                    value="student"
                    {...register('role')}
                  />
                  <span>Student</span>
                </label>
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-muted">
                  <input
                    type="radio"
                    className="mr-2"
                    value="club_leader"
                    {...register('role')}
                  />
                  <span>Club Leader</span>
                </label>
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            isLoading={isSubmitting}
            fullWidth
            size="lg"
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}