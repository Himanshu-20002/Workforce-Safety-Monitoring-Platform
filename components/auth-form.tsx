'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AuthForm({ mode: initialMode = 'sign-in' }: { mode?: 'sign-in' | 'sign-up' } = {}) {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'supervisor'>('supervisor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'sign-in') {
        const { data, error: authError } = await authClient.signIn.email({
          email,
          password,
        });
        
        if (authError) {
          setError(authError.message || 'Invalid email or password');
          setLoading(false);
          return;
        }

        if (data?.user) {
          window.location.href = '/';
        }
      } else {
        const { data, error: authError } = await authClient.signUp.email({
          email,
          password,
          name,
          role,
        });

        if (authError) {
          setError(authError.message || 'Failed to sign up');
          setLoading(false);
          return;
        }

        if (data?.user) {
          window.location.href = '/';
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {mode === 'sign-in' ? 'Sign In' : 'Sign Up'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === 'sign-in'
            ? 'Enter your credentials to access the platform'
            : 'Create a new account to get started'}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'sign-up' && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Full Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'supervisor')}
                disabled={loading}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="supervisor">Supervisor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Password
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? mode === 'sign-in'
              ? 'Signing in...'
              : 'Signing up...'
            : mode === 'sign-in'
              ? 'Sign In'
              : 'Sign Up'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          {mode === 'sign-in' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
            className="font-semibold text-primary hover:underline"
          >
            {mode === 'sign-in' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>

      {mode === 'sign-in' && (
        <div className="mt-6 rounded-md bg-muted p-4 text-sm space-y-3">
          <div>
            <p className="font-medium text-foreground mb-2">Quick Start:</p>
            <p className="text-muted-foreground">1. Click "Sign Up" to create an account</p>
            <p className="text-muted-foreground">2. Choose your role (Admin, Supervisor, or Worker)</p>
            <p className="text-muted-foreground">3. After signup, you'll be logged in</p>
          </div>
          <div className="border-t border-border pt-2">
            <p className="font-medium text-foreground mb-1">Demo Credentials to Try:</p>
            <p className="text-muted-foreground">
              Email: <code className="font-mono bg-background px-1 py-0.5 rounded">admin@example.com</code>
            </p>
            <p className="text-muted-foreground">
              Password: <code className="font-mono bg-background px-1 py-0.5 rounded">admin123</code>
            </p>
            <p className="text-xs text-muted-foreground mt-2">(Create this account in Sign Up first)</p>
          </div>
        </div>
      )}
    </div>
  );
}
