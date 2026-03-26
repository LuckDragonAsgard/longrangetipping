'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { fetchPublicComps } from '@/lib/supabase-db';

interface BrowseComp {
  id: string;
  name: string;
  description: string;
  invite_code: string;
  is_public: boolean;
  season_year: number;
  tip_deadline: string;
  creator_id: string;
  members: { user_id: string; display_name: string; joined_at: string }[];
}

export default function BrowsePage() {
  const { user, joinComp } = useApp();
  const [search, setSearch] = useState('');
  const [publicComps, setPublicComps] = useState<BrowseComp[]>([]);
  const [loadingComps, setLoadingComps] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicComps()
      .then(comps => setPublicComps(comps))
      .catch(err => console.error('Failed to load public comps:', err))
      .finally(() => setLoadingComps(false));
  }, []);

  const filtered = publicComps.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  async function handleJoin(compId: string) {
    if (!user?.isLoggedIn) {
      window.location.href = '/signup';
      return;
    }
    setJoiningId(compId);
    try {
      await joinComp(compId);
      // Refresh the public comps list to update member counts
      const updated = await fetchPublicComps();
      setPublicComps(updated);
    } catch (err: any) {
      alert(err?.message || 'Failed to join comp');
    } finally {
      setJoiningId(null);
    }
  }

  return (
    <div className="min-h-[80vh]">
      {/* Header */}
      <section className="relative overflow-hidden pt-12 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1040] via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Browse <span className="gradient-text">Public Comps</span>
            </h1>
            <p className="text-[#a0a0cc] text-lg max-w-2xl mx-auto">
              Find and join public AFL tipping competitions. Or create your own and invite your mates.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-12">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field text-center"
              placeholder="Search comps by name or description..."
            />
          </div>
        </div>
      </section>

      {/* Comps Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {loadingComps ? (
          <div className="text-center py-20">
            <p className="text-[#a0a0cc]">Loading comps...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(comp => {
              const isMember = user && comp.members.some(m => m.user_id === user.id);

              return (
                <div
                  key={comp.id}
                  className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-6 card-hover flex flex-col"
                >
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">{comp.name}</h3>
                    <p className="text-sm text-[#a0a0cc] line-clamp-2">{comp.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-[#a0a0cc] mb-4 mt-auto pt-4 border-t border-[#2a2a5a]">
                    <div>
                      <span className="font-semibold text-white">{comp.members.length}</span>
                      <span> members</span>
                    </div>
                    <div>
                      <span>Code: </span>
                      <span className="font-semibold text-[#a78bfa]">{comp.invite_code}</span>
                    </div>
                  </div>

                  {/* Join Button */}
                  {isMember ? (
                    <a
                      href={`/comp/${comp.invite_code}`}
                      className="btn-primary w-full !text-center !py-2 block"
                    >
                      View Comp
                    </a>
                  ) : user?.isLoggedIn ? (
                    <button
                      onClick={() => handleJoin(comp.id)}
                      disabled={joiningId === comp.id}
                      className="btn-primary w-full !text-center !py-2 disabled:opacity-50"
                    >
                      {joiningId === comp.id ? 'Joining...' : 'Join Comp'}
                    </button>
                  ) : (
                    <a href="/signup" className="btn-primary w-full !text-center !py-2 block">
                      Sign Up to Join
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">No comps found</h2>
            <p className="text-[#a0a0cc] mb-8">
              {publicComps.length === 0 ? (
                <>Be the first to <a href="/create" className="text-[#6366f1] hover:underline font-medium">create a public comp</a>!</>
              ) : (
                <>Try a different search or <a href="/create" className="text-[#6366f1] hover:underline font-medium">create your own comp</a>.</>
              )}
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      {filtered.length > 0 && (
        <section className="bg-[#111128]/50 py-16 mt-20 border-t border-[#2a2a5a]">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-3">Want to run your own comp?</h2>
            <p className="text-[#a0a0cc] mb-6">
              Create a private comp for your mates, family, or workmates. Invite via code or make it public.
            </p>
            <a href="/create" className="btn-primary">
              Create a Comp →
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
