'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    router.push(redirect);
  };

  const handleGoogleAuth = () => {
    login('google_user@example.com');
    router.push(redirect);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-background-secondary border border-border p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Activity className="w-10 h-10 text-neon mb-4" />
          <h1 className="text-2xl font-heading font-bold text-white tracking-wider">
            {isLogin ? 'WELCOME BACK' : 'JOIN FUELFITNESS'}
          </h1>
          <p className="text-text-secondary text-sm mt-2 text-center">
            {isLogin
              ? 'Enter your credentials to access your account.'
              : 'Create an account to track orders and checkout faster.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Input label="Full Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <Input label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {isLogin && (
            <div className="flex justify-end">
              <a href="#" className="text-xs text-neon hover:underline">Forgot password?</a>
            </div>
          )}

          <Button type="submit" fullWidth className="mt-6">
            {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px bg-border flex-1" />
          <span className="text-xs text-text-secondary uppercase tracking-wider">OR CONTINUE WITH</span>
          <div className="h-px bg-border flex-1" />
        </div>

        <button
          onClick={handleGoogleAuth}
          className="mt-6 w-full flex items-center justify-center gap-3 bg-white text-black font-medium py-3 px-4 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <GoogleIcon />
          Google
        </button>

        <div className="mt-8 text-center text-sm text-text-secondary">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-neon font-medium hover:underline cursor-pointer">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
