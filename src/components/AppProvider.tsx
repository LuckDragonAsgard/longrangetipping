'use client';

import { useState, useCallback, useEffect, ReactNode } from 'react';
import { AppContext, AppState, UserState, CompState, TipState } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import {
  fetchProfile,
  fetchUserComps,
  fetchPublicComps,
  getCompMemberId,
  fetchTips,
  saveTips as saveTipsDb,
  joinComp as joinCompDb,
} from '@/lib/supabase-db';

export default function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserState | null>(null);
  const [comps, setComps] = useState<CompState[]>([]);
  const [tips, setTipsState] = useState<{ [compId: string]: TipState }>({});
  const [loading, setLoading] = useState(true);
  // Cache comp_member_id lookups: { "inviteCode": comp_member_id }
  const [memberIdCache, setMemberIdCache] = useState<{ [key: string]: string }>({});

  // ─── Auth Session Check ─────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          const profile = await fetchProfile(session.user.id);
          setUserState({
            id: session.user.id,
            email: session.user.email || '',
            display_name: profile.display_name || session.user.email?.split('@')[0] || 'User',
            isLoggedIn: true,
          });

          // Load user's comps
          const userComps = await fetchUserComps(session.user.id);
          setComps(userComps);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const profile = await fetchProfile(session.user.id);
          setUserState({
            id: session.user.id,
            email: session.user.email || '',
            display_name: profile.display_name || session.user.email?.split('@')[0] || 'User',
            isLoggedIn: true,
          });
          const userComps = await fetchUserComps(session.user.id);
          setComps(userComps);
        } catch (err) {
          console.error('Auth state change error:', err);
        }
      } else if (event === 'SIGNED_OUT') {
        setUserState(null);
        setComps([]);
        setTipsState({});
        setMemberIdCache({});
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ─── User ───────────────────────────────────────────────────────
  const setUser = useCallback((u: UserState | null) => {
    if (!u) {
      supabase.auth.signOut();
    }
    setUserState(u);
  }, []);

  // ─── Comps ──────────────────────────────────────────────────────
  const addComp = useCallback((comp: CompState) => {
    setComps(prev => [...prev, comp]);
  }, []);

  const refreshComps = useCallback(async () => {
    if (!user) return;
    try {
      const userComps = await fetchUserComps(user.id);
      setComps(userComps);
    } catch (err) {
      console.error('Failed to refresh comps:', err);
    }
  }, [user]);

  const joinComp = useCallback(async (compId: string) => {
    if (!user) return;
    try {
      await joinCompDb(compId, user.id);
      // Refresh comps to include the newly joined one
      const userComps = await fetchUserComps(user.id);
      setComps(userComps);
    } catch (err: any) {
      console.error('Join comp error:', err);
      throw err;
    }
  }, [user]);

  // ─── Tips ───────────────────────────────────────────────────────
  const setTips = useCallback((compId: string, newTips: TipState) => {
    setTipsState(prev => ({ ...prev, [compId]: newTips }));
  }, []);

  const setTip = useCallback((compId: string, matchId: number, teamId: number) => {
    setTipsState(prev => ({
      ...prev,
      [compId]: { ...(prev[compId] || {}), [matchId]: teamId },
    }));
  }, []);

  // Find comp_member_id for a given invite code and current user
  const getOrCacheMemberId = useCallback(async (inviteCode: string): Promise<string | null> => {
    if (memberIdCache[inviteCode]) return memberIdCache[inviteCode];
    if (!user) return null;

    // Find the comp by invite code
    const comp = comps.find(c => c.invite_code === inviteCode);
    if (!comp) return null;

    const memberId = await getCompMemberId(comp.id, user.id);
    if (memberId) {
      setMemberIdCache(prev => ({ ...prev, [inviteCode]: memberId }));
    }
    return memberId;
  }, [user, comps, memberIdCache]);

  const loadTipsFromDb = useCallback(async (inviteCode: string) => {
    const memberId = await getOrCacheMemberId(inviteCode);
    if (!memberId) return;

    try {
      const dbTips = await fetchTips(memberId);
      setTipsState(prev => ({ ...prev, [inviteCode]: dbTips }));
    } catch (err) {
      console.error('Failed to load tips:', err);
    }
  }, [getOrCacheMemberId]);

  const saveTipsToDb = useCallback(async (inviteCode: string): Promise<{ saved: number; errors: number }> => {
    const memberId = await getOrCacheMemberId(inviteCode);
    if (!memberId) return { saved: 0, errors: 0 };

    const compTips = tips[inviteCode] || {};
    try {
      const result = await saveTipsDb(memberId, compTips);
      return result;
    } catch (err) {
      console.error('Failed to save tips:', err);
      return { saved: 0, errors: Object.keys(compTips).length };
    }
  }, [getOrCacheMemberId, tips]);

  // ─── Context Value ──────────────────────────────────────────────
  const value: AppState = {
    user,
    comps,
    tips,
    loading,
    setUser,
    addComp,
    joinComp,
    setTips,
    setTip,
    saveTipsToDb,
    loadTipsFromDb,
    refreshComps,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
