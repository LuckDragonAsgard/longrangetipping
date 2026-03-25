'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';

interface PublicComp {
  id: string;
  name: string;
  description: string;
  invite_code: string;
  member_count: number;
  creator_name: string;
}

const DEMO_COMPS: PublicComp[] = [
  {
    id: 'demo-1',
    name: 'The Big Footy Tip-Off',
    description: 'Open comp for anyone who loves AFL. Bragging rights only!',
    invite_code: 'BIGFT26',
    member_count: 47,
    creator_name: 'FootyFan99',
  },
  {
    id: 'demo-2',
    name: 'Reddit AFL Tips',
    description: 'The official r/AFL long range tipping comp.',
    invite_code: 'REDDIT26',
    member_count: 234,
    creator_name: 'ModTeam',
  },
  {
    id: 'demo-3',
    name: 'Office Legends',
    description: 'Who in the office knows their footy best?',
    invite_code: 'OFFICE26',
    member_count: 18,
    creator_name: 'Karen',
  },
  {
    id: 'demo-4',
    name: 'Pub Footy Experts',
    description: 'Every punter at The Local thinks they know best. Prove it.',
    invite_code: 'PUBEX26',
    member_count: 92,
    creator_name: 'BarTab Steve',
  },
];

export default function BrowsePage() {
  const { user, comps, joinComp } = useApp();
  const [search, setSearch] = useState('');

  // Combine user-created public comps with demo comps
  const publicComps = [
    ...comps.filter(c => c.is_public),
    ...DEMO_COMPS,
  ];

  const filtered = publicComps.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  function handleJoin(compId: string) {
    if (!user?.isLoggedIn) {
      window.location.href = '/signup';
      return;
    }
    joinComp(compId);
    alert('Joined comp successfully!');
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
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(comp => {
              const memberCount = 'member_count' in comp ? comp.member_count : comp.members.length;
              const creatorName =
                'creator_name' in comp
                  ? comp.creator_name
                  : comps.find(c => c.id === comp.id)?.members[0]?.display_name || 'Unknown';

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
                      <span className="font-semibold text-white">{memberCount}</span>
                      <span> members</span>
                    </div>
                    <div>
                      <span>by </span>
                      <span className="font-semibold text-white">{creatorName}</span>
                    </div>
                  </div>

                  {/* Join Button */}
                  {user?.isLoggedIn ? (
                    <button
                      onClick={() => handleJoin(comp.id)}
                      className="btn-primary w-full !text-center !py-2"
                    >
                      Join Comp
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
              Try a different search or{' '}
              <a href="/create" className="text-[#6366f1] hover:underline font-medium">
                create your own comp
              </a>
              .
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
