'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName.trim(),
        },
      },
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
          <h1 className="text-3xl font-bold mb-2">Join the Comp</h1>
          <p className="text-[#a0a0cc]">Create your account and start tipping</p>
        </div>
        <form onSubmit={handleSignUp} className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg p-3 text-sm">
              ✓ Account created! Welcome aboard...
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="input-field"
              placeholder="What your mates call you"
              required
              disabled={loading}
            />
          </div>
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
              placeholder="At least 6 characters"
              required
              minLength={6}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || success}
            className="btn-primary w-full !text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : success ? 'Redirecting...' : 'Sign Up Free'}
          </button>

          <p className="text-center text-sm text-[#a0a0cc]">
            Already have an account? <a href="/login" className="text-[#6366f1] hover:underline">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
