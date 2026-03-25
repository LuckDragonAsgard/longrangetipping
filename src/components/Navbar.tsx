'use client';

import { useApp } from '@/lib/store';
import Link from 'next/link';

export default function Navbar() {
  const { user, setUser } = useApp();

  function handleLogout() {
    setUser(null);
  }

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[#0a0a1a]/80 border-b border-[#2a2a5a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏈</span>
            <span className="font-bold text-xl gradient-text hidden sm:inline">Long Range Tipping</span>
            <span className="font-bold text-xl gradient-text sm:hidden">LRT</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/browse" className="text-sm text-[#a0a0cc] hover:text-white transition-colors hidden sm:block">Browse</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm text-[#a0a0cc] hover:text-white transition-colors">Dashboard</Link>
                <div className="flex items-center gap-2">
                  <Link href="/profile" className="w-8 h-8 bg-gradient-to-br from-[#6366f1] to-[#a855f7] rounded-full flex items-center justify-center text-sm font-bold">
                    {user.display_name.charAt(0)}
                  </Link>
                  <button onClick={handleLogout} className="text-xs text-[#a0a0cc] hover:text-white transition-colors">Logout</button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm !py-2 !px-4">Log In</Link>
                <Link href="/signup" className="btn-primary text-sm !py-2 !px-4">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
