'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, generateInviteCode } from '@/lib/store';
import { createComp } from '@/lib/supabase-db';

export default function CreatePage() {
  const router = useRouter();
  const { user, addComp, refreshComps, loading } = useApp();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && (!user || !user.isLoggedIn)) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '2026-03-05T19:30',
    isPublic: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  if (loading || !user?.isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-[#a0a0cc]">Loading...</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter a comp name');
      return;
    }

    if (!user) return;

    setCreating(true);
    const code = generateInviteCode(formData.name);

    try {
      const newComp = await createComp({
        name: formData.name,
        description: formData.description,
        invite_code: code,
        is_public: formData.isPublic,
        creator_id: user.id,
        tip_deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
      });

      // Refresh comps in the context
      await refreshComps();

      setInviteCode(code);
      setShowSuccess(true);
    } catch (err: any) {
      // If invite code collision, try again
      if (err?.code === '23505') {
        setError('That invite code is taken. Please try again.');
      } else {
        setError(err?.message || 'Failed to create comp. Try again.');
      }
    } finally {
      setCreating(false);
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <div className="text-6xl">🎉</div>
            </div>
            <h1 className="text-4xl font-bold mb-3">Comp Created!</h1>
            <p className="text-[#a0a0cc] text-lg">
              Your {formData.name} comp is ready to go. Share the code below with your mates.
            </p>
          </div>

          <div className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-8 space-y-8">
            {/* Invite Code Display */}
            <div className="text-center">
              <p className="text-[#a0a0cc] text-sm mb-4">Invite Code</p>
              <div className="bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] p-0.5 rounded-xl mb-4">
                <div className="bg-[#0a0a1a] rounded-[10px] py-8 px-6">
                  <p className="text-5xl font-black tracking-widest">{inviteCode}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inviteCode);
                  alert('Code copied!');
                }}
                className="text-[#6366f1] hover:text-[#818cf8] text-sm font-medium"
              >
                Click to copy
              </button>
            </div>

            {/* Shareable Link */}
            <div className="text-center pt-6 border-t border-[#2a2a5a]">
              <p className="text-[#a0a0cc] text-sm mb-3">Or share this link:</p>
              <code className="text-xs bg-[#1a1a3e] border border-[#2a2a5a] rounded-lg p-3 block text-[#a78bfa] break-all">
                longrangetipping.com/comp/{inviteCode}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`longrangetipping.com/comp/${inviteCode}`);
                  alert('Link copied!');
                }}
                className="text-[#6366f1] hover:text-[#818cf8] text-sm font-medium mt-2"
              >
                Click to copy link
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => router.push(`/comp/${inviteCode}`)}
                className="flex-1 btn-primary !text-center"
              >
                Go to Comp
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 btn-secondary !text-center"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Create a <span className="gradient-text">Comp</span>
          </h1>
          <p className="text-[#a0a0cc] text-lg">
            Set up a tipping competition and invite your mates to compete.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Comp Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Comp Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g., The Big Office Tipping Comp"
              required
            />
            <p className="text-xs text-[#a0a0cc] mt-1">This will be shown to people joining your comp</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="input-field resize-none"
              placeholder="Optional: Tell people what your comp is about, any house rules, or why they should join"
              rows={4}
            />
          </div>

          {/* Tipping Deadline */}
          <div>
            <label className="block text-sm font-medium mb-2">Tipping Deadline</label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
              className="input-field"
            />
            <p className="text-xs text-[#a0a0cc] mt-1">
              When should members lock in their tips? (default: Round 1 kickoff)
            </p>
          </div>

          {/* Public/Private Toggle */}
          <div>
            <label className="block text-sm font-medium mb-4">Comp Visibility</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPublic: false })}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  !formData.isPublic
                    ? 'bg-[#6366f1] text-white'
                    : 'bg-[#1a1a3e] border border-[#2a2a5a] text-[#a0a0cc] hover:border-[#6366f1]'
                }`}
              >
                🔒 Private
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPublic: true })}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  formData.isPublic
                    ? 'bg-[#6366f1] text-white'
                    : 'bg-[#1a1a3e] border border-[#2a2a5a] text-[#a0a0cc] hover:border-[#6366f1]'
                }`}
              >
                🌍 Public
              </button>
            </div>
            <p className="text-xs text-[#a0a0cc] mt-3">
              {formData.isPublic
                ? 'Anyone can find and join this comp from the browse page.'
                : 'Only people with the invite code can join.'}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={creating}
            className="btn-primary w-full !text-center mt-8 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create Comp →'}
          </button>
        </form>
      </div>
    </div>
  );
}
