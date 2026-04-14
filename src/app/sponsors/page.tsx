'use client';

import Link from 'next/link';

const TIERS = [
  {
    name: 'Bronze',
    price: '$500/season',
    color: '#cd7f32',
    features: [
      'Your logo on one comp',
      'Custom brand colours',
      'Prize description shown to all members',
      'Mentioned in comp invite links',
    ],
  },
  {
    name: 'Silver',
    price: '$2,000/season',
    color: '#a0a0cc',
    popular: true,
    features: [
      'Everything in Bronze',
      'Featured banner on comp page',
      'Logo on Browse Public Comps page',
      'Up to 3 branded comps',
      'Monthly engagement report',
    ],
  },
  {
    name: 'Gold',
    price: '$5,000/season',
    color: '#fbbf24',
    features: [
      'Everything in Silver',
      'Homepage banner placement',
      'Unlimited branded comps',
      'Custom prize pools (cash, merch, subscriptions)',
      'Dedicated sponsor dashboard',
      'Priority support',
    ],
  },
];

const STATS = [
  { label: 'Active Tippers', value: '50+', note: 'and growing fast' },
  { label: 'Tips Entered', value: '5,000+', note: 'across all comps' },
  { label: 'Games Per Season', value: '198', note: 'full AFL fixture' },
  { label: 'Season Length', value: '6 months', note: 'March to September' },
];

export default function SponsorsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1040] via-[#0a0a1a] to-[#0a0a1a]" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20 mb-6">
            Sponsorship Opportunities
          </span>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
            Put Your Brand in Front of{' '}
            <span className="bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">
              Footy Fans
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-[#a0a0cc] max-w-3xl mx-auto mb-10">
            Sponsor a tipping comp on Long Range Tipping. Your brand, your colours, your prizes  -  seen
            by engaged AFL fans every week for the entire season.
          </p>
          <a
            href="mailto:pgallivan@outlook.com?subject=Long Range Tipping Sponsorship Enquiry"
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-black font-bold text-lg hover:shadow-lg hover:shadow-[#fbbf24]/20 transition-all"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* What You Get */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          Why Sponsor a <span className="gradient-text">Tipping Comp</span>?
        </h2>
        <p className="text-[#a0a0cc] text-center max-w-2xl mx-auto mb-16">
          AFL tipping is one of Australia&apos;s biggest social sports traditions. Your brand gets repeated
          weekly exposure to passionate, engaged fans who check in every round.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '\u{1F3AF}', title: 'Targeted Reach', desc: 'Your brand reaches passionate AFL fans  -  not random web traffic. Every member is engaged and returning weekly.' },
            { icon: '\u{1F4C8}', title: 'Season-Long Exposure', desc: '6 months of continuous brand visibility. Your logo and colours are seen every time they check their tips.' },
            { icon: '\u{1F3C6}', title: 'Prize Association', desc: 'Attach your brand to prizes. Winners remember who funded the prize pool  -  powerful brand recall.' },
            { icon: '\u{1F91D}', title: 'Community Goodwill', desc: 'Supporting free, ad-free footy tipping earns genuine community appreciation. No pop-ups, no annoyance.' },
          ].map((item, i) => (
            <div key={i} className="bg-[#111128] border border-[#2a2a5a] rounded-2xl p-6 card-hover">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-[#a0a0cc]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#111128]/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Platform at a Glance</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-black text-[#fbbf24] mb-1">{stat.value}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-xs text-[#a0a0cc]">{stat.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          Sponsorship <span className="gradient-text">Tiers</span>
        </h2>
        <p className="text-[#a0a0cc] text-center max-w-xl mx-auto mb-16">
          Choose the level of visibility that works for your brand and budget.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`bg-[#111128] border rounded-2xl p-8 relative ${
                tier.popular
                  ? 'border-[#fbbf24] shadow-lg shadow-[#fbbf24]/10'
                  : 'border-[#2a2a5a]'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#fbbf24] text-black text-xs font-bold rounded-full">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-6">
                <div
                  className="text-3xl font-black mb-2"
                  style={{ color: tier.color }}
                >
                  {tier.name}
                </div>
                <div className="text-2xl font-bold">{tier.price}</div>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-[#14b8a6] flex-shrink-0 mt-0.5">&#10003;</span>
                    <span className="text-[#a0a0cc]">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:pgallivan@outlook.com?subject=${tier.name} Sponsorship  -  Long Range Tipping`}
                className="block w-full py-3 rounded-lg font-semibold text-center transition-all"
                style={{
                  backgroundColor: tier.color + '20',
                  color: tier.color,
                  borderWidth: '1px',
                  borderColor: tier.color + '40',
                }}
              >
                Enquire Now
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#111128]/50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How Sponsored Comps Work</h2>
          <div className="space-y-8">
            {[
              { step: '1', title: 'Choose Your Tier', desc: 'Pick the sponsorship level that matches your goals and budget.' },
              { step: '2', title: 'Send Us Your Assets', desc: 'Logo, banner image, brand colours, and prize details. We set it all up.' },
              { step: '3', title: 'Your Branded Comp Goes Live', desc: 'A custom-branded competition appears on the platform with your colours, logo, and prizes.' },
              { step: '4', title: 'Fans Join & Engage All Season', desc: 'Members see your brand every time they check tips, results, or the leaderboard.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/30 flex items-center justify-center text-[#fbbf24] font-bold text-lg flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-[#a0a0cc]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          Ready to reach footy fans?
        </h2>
        <p className="text-xl text-[#a0a0cc] mb-10">
          The 2026 AFL season is underway. Get your brand in front of engaged tippers today.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="mailto:pgallivan@outlook.com?subject=Long Range Tipping Sponsorship Enquiry"
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-black font-bold text-lg hover:shadow-lg hover:shadow-[#fbbf24]/20 transition-all"
          >
            Contact Us
          </a>
          <Link href="/browse" className="btn-secondary text-lg !py-3 !px-8">
            See Live Comps
          </Link>
        </div>
      </section>
    </div>
  );
}
