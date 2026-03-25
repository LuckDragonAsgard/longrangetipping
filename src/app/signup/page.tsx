'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, DEMO_USER } from '@/lib/store';

export default function SignUpPage() {
  const router = useRouter();
  const { user, setUser } = useApp();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user?.isLoggedIn) {
      router.push('/dashboard');
    }
  }, [user, router]);

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Validate fields
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    // Simulate signup delay
    setTimeout(() => {
      // Demo mode: create user and log them in immediately
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        display_name: displayName,
        isLoggedIn: true,
      };

      setUser(newUser);
      setSuccess(true);

      // Redirect after brief success animation
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }, 800);
  }

  function handleDemoSignup() {
    setLoading(true);
    setError('');

    // Simulate signup delay
    setTimeout(() => {
      setUser(DEMO_USER);
      setSuccess(true);

      // Redirect after brief success animation
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }, 600);
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
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-sm animate-pulse">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg p-3 text-sm animate-pulse">
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2a5a]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#111128] text-[#a0a0cc]">quick start</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoSignup}
            disabled={loading || success}
            className="w-full bg-[#2a2a5a] hover:bg-[#3a3a6a] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Quick Demo Mode'}
          </button>

          <p className="text-center text-sm text-[#a0a0cc]">
            Already have an account? <a href="/login" className="text-[#6366f1] hover:underline">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
