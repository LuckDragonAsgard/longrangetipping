'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { AFL_2026_FIXTURE } from '@/lib/fixture-data';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, comps, tips, loading } = useApp();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && (!user || !user.isLoggedIn)) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Initialize display name
  useEffect(() => {
    if (user?.display_name) {
      setDisplayName(user.display_name);
    }
  }, [user]);

  if (!user?.isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-[#a0a0cc]">Loading...</p>
      </div>
    );
  }

  function handleDisplayNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newName = e.target.value;
    setDisplayName(newName);
    setHasChanges(user ? newName !== user.display_name : false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) {
      alert('Display name cannot be empty');
      return;
    }

    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName.trim() })
        .eq('id', user.id);

      if (error) throw error;

      setUser({
        ...user,
        display_name: displayName.trim(),
      });
      setHasChanges(false);
    } catch (err: any) {
      alert(err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  // Calculate stats
  const compsJoined = comps.filter(c => c.members.some(m => m.user_id === user?.id)).length;

  // Count total tips
  let totalTips = 0;
  for (const compId in tips) {
    totalTips += Object.keys(tips[compId]).length;
  }

  // Calculate accuracy based on completed games
  const completedGames = AFL_2026_FIXTURE.filter(g => g.complete);
  let correctTips = 0;
  for (const compId in tips) {
    const compTips = tips[compId];
    for (const matchId in compTips) {
      const matchIdNum = parseInt(matchId);
      const game = AFL_2026_FIXTURE.find(g => g.id === matchIdNum);
      if (game && game.complete && game.winner_team_id === compTips[matchIdNum]) {
        correctTips++;
      }
    }
  }

  const accuracy =
    completedGames.length > 0
      ? Math.round((correctTips / completedGames.length) * 100)
      : 0;

  // Get user's comps
  const userComps = comps.filter(c => c.members.some(m => m.user_id === user?.id));

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
          <p className="text-[#a0a0cc]">Manage your account and view your stats</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Avatar & Info Card */}
            <div className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-8">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-[#6366f1] via-[#a855f7] to-[#ec4899] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl font-bold text-white">{displayName.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{displayName}</h2>
                  <p className="text-[#a0a0cc]">{user.email}</p>
                </div>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={handleDisplayNameChange}
                    className="input-field"
                    placeholder="Your display name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="input-field opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-[#a0a0cc] mt-1">Email is permanent and cannot be changed</p>
                </div>

                <button
                  type="submit"
                  disabled={saving || !hasChanges}
                  className="btn-primary w-full !text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Stats Section */}
            <div className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Your Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#1a1a3e] to-[#0a0a1a] border border-[#2a2a5a] rounded-xl p-6 text-center card-hover">
                  <div className="text-3xl font-black gradient-text mb-2">{compsJoined}</div>
                  <div className="text-xs text-[#a0a0cc] font-medium">Comps Joined</div>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a3e] to-[#0a0a1a] border border-[#2a2a5a] rounded-xl p-6 text-center card-hover">
                  <div className="text-3xl font-black gradient-text mb-2">{totalTips}</div>
                  <div className="text-xs text-[#a0a0cc] font-medium">Total Tips</div>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a3e] to-[#0a0a1a] border border-[#2a2a5a] rounded-xl p-6 text-center card-hover">
                  <div className="text-3xl font-black gradient-text mb-2">{accuracy}%</div>
                  <div className="text-xs text-[#a0a0cc] font-medium">Accuracy</div>
                </div>
              </div>
              {completedGames.length === 0 && (
                <p className="text-xs text-[#a0a0cc] mt-4 text-center">
                  Accuracy will calculate once games are completed.
                </p>
              )}
            </div>
          </div>

          {/* Comps Sidebar */}
          <div className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-6 h-fit">
            <h3 className="text-lg font-bold mb-4">Your Comps</h3>
            {userComps.length > 0 ? (
              <div className="space-y-3">
                {userComps.map(comp => (
                  <a
                    key={comp.id}
                    href={`/comp/${comp.invite_code}`}
                    className="block p-3 bg-[#1a1a3e] border border-[#2a2a5a] rounded-lg hover:border-[#6366f1] transition-colors group"
                  >
                    <p className="font-medium text-sm group-hover:text-[#6366f1] transition-colors line-clamp-2">
                      {comp.name}
                    </p>
                    <p className="text-xs text-[#a0a0cc] mt-1">{comp.members.length} members</p>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-[#a0a0cc] mb-3">No comps yet</p>
                <a href="/browse" className="btn-secondary !py-1.5 !px-3 !text-xs w-full !text-center">
                  Browse Comps
                </a>
              </div>
            )}
            <a href="/create" className="btn-primary w-full !text-center !py-2 mt-4 !text-sm">
              Create New Comp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}