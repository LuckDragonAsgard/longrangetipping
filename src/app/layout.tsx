import type { Metadata } from 'next';
import './globals.css';
import AppProvider from '@/components/AppProvider';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Long Range Tipping - AFL Season Tipping',
  description: 'Tip every AFL game for the entire season upfront. Create comps, invite mates, and watch the leaderboard unfold all season long.',
  keywords: ['AFL', 'tipping', 'footy', 'predictions', 'competition'],
  openGraph: {
    title: 'Long Range Tipping',
    description: 'Tip every AFL game before Round 1. Create comps, invite mates, compete all season.',
    type: 'website',
    url: 'https://longrangetipping.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased">
        <AppProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <footer className="border-t border-[#2a2a5a] mt-20 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-[#a0a0cc] text-sm">
              <p>&copy; 2026 Long Range Tipping. Built with 🏈 by footy fans, for footy fans.</p>
              <p className="mt-1">AFL data provided by <a href="https://squiggle.com.au" className="text-[#6366f1] hover:underline" target="_blank" rel="noopener">Squiggle</a></p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
