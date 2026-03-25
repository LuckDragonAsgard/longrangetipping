'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, DEMO_USER } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { user, setUser } = useApp();
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

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Validate fields
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    // Simulate login delay
    setTimeout(() => {
      // Demo mode: accept any valid email/password combination
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        display_name: email.split('@')[0],
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

  function handleDemoLogin() {
    setLoading(true);
    setError('');

    // Simulate login delay
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
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-[#a0a0cc]">Log in to check your tips and leaderboard</p>
        </div>
        <form onSubmit={handleLogin} className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-sm animate-pulse">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg p-3 text-sm animate-pulse">
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2a5a]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#111128] text-[#a0a0cc]">or try demo</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading || success}
            className="w-full bg-[#2a2a5a] hover:bg-[#3a3a6a] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Demo Login...' : 'Quick Demo Login'}
          </button>

          <p className="text-center text-sm text-[#a0a0cc]">
            Don&apos;t have an account? <a href="/signup" className="text-[#6366f1] hover:underline">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
