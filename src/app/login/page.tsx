'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/dashboard'), 500);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-[#a0a0cc]">Log in to check your tips and leaderboard</p>
        </div>
        <form onSubmit={handleLogin} className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg p-3 text-sm">
              ✓ Login successful! Redirecting...
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || success}
            className="btn-primary w-full !text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : success ? 'Welcome!' : 'Log In'}
          </button>

          <p className="text-center text-sm text-[#a0a0cc]">
            Don&apos;t have an account? <a href="/signup" className="text-[#6366f1] hover:underline">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
