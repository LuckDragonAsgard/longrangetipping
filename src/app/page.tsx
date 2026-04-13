'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';

export default function Home() {
  const { user, comps, loading } = useApp();
  const router = useRouter();
  const [code, setCode] = useState('');

  // Auto-redirect logged-in users with comps to their first comp
  useEffect(() => {
    if (!loading && user && comps.length > 0) {
      router.push(`/comp/${comps[0].invite_code}`);
    }
  }, [loading, user, comps, router]);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/comp/${code.trim().toUpperCase()}`);
    }
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6366f1]"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1040] via-[#0a0a1a] to-[#0a0a1a]" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32 text-center">
          <div className="animate-fade-in">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-[#6366f1]/10 text-[#a78bfa] border border-[#6366f1]/20 mb-6">
              AFL Season 2026
            </span>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
              Tip the <span className="gradient-text">Whole Season</span>
              <br />Before Round 1
            </h1>
            <p className="text-xl sm:text-2xl text-[#a0a0cc] max-w-2xl mx-auto mb-10">
              Lock in your picks for every AFL game of the season upfront.
              No weekly tipping, no last-minute changes. Just pure footy instinct.
            </p>

            {/* Invite Code Form */}
            <form onSubmit={handleJoin} className="max-w-md mx-auto mb-8">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your invite code"
                  className="flex-1 px-4 py-3 rounded-xl bg-[#111128] border border-[#2a2a5a] text-white placeholder-[#666] focus:outline-none focus:border-[#6366f1] text-lg"
                />
                <button
                  type="submit"
                  className="btn-primary text-lg !py-3 !px-6 whitespace-nowrap"
                >
                  Join Comp
                </button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a href="/signup" className="btn-primary text-lg !py-3 !px-8">
                Create Your Comp
              </a>
              <a href="/browse" className="btn-secondary text-lg !py-3 !px-8">
                Browse Public Comps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
          How It <span className="gradient-text">Works</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '\u{1F4CB}', title: 'Create or Join a Comp', desc: 'Set up a comp and share the invite link with your mates, family, or workmates. Or browse public comps to join.' },
            { icon: '\u{1F3C8}', title: 'Tip Every Game', desc: 'Before the season kicks off, tip the winner of every single match. All 198 games, locked in from day one.' },
            { icon: '\u{1F3C6}', title: 'Watch the Leaderboard', desc: 'Results update automatically after every round. Watch the ladder shift as the season unfolds. No effort required.' },
          ].map((step, i) => (
            <div key={i} className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-8 card-hover text-center" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-[#a0a0cc] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#111128]/50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Built for <span className="gradient-text">Footy Fans</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '\u26A1', title: 'Auto Results', desc: 'Scores update automatically after each game. Zero manual work.' },
              { icon: '\u{1F512}', title: 'Tips Locked In', desc: 'No changing your mind mid-season. Commit to your tips and own them.' },
              { icon: '\u{1F465}', title: 'Public & Private', desc: 'Run a comp with your mates or open it up for anyone to join.' },
              { icon: '\u{1F4CA}', title: 'Live Leaderboard', desc: 'Rankings update in real-time. Track accuracy, streaks, and more.' },
              { icon: '\u{1F3AF}', title: 'Full Season View', desc: 'See every round, every game, every tip at a glance.' },
              { icon: '\u{1F4F1}', title: 'Mobile Ready', desc: 'Tip from your phone, tablet, or laptop. Works everywhere.' },
              { icon: '\u{1F193}', title: 'Completely Free', desc: 'No subscriptions, no ads, no catch. Just footy tipping.' },
              { icon: '\u{1F3C8}', title: 'AFL Focused', desc: 'Built specifically for AFL. Every team, every round, every venue.' },
            ].map((f, i) => (
              <div key={i} className="bg-[#1a1a3e]/50 border border-[#2a2a5a] rounded-xl p-6 card-hover">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold mb-1">{f.title}</h3>
                <p className="text-sm text-[#a0a0cc]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          Ready to back yourself?
        </h2>
        <p className="text-xl text-[#a0a0cc] mb-10">
          The 2026 AFL season is coming. Get your comp set up and start tipping.
        </p>
        <a href="/signup" className="btn-primary text-xl !py-4 !px-10">
          Get Started Free
        </a>
      </section>
    </div>
  );
}
