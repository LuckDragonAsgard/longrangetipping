import { supabase } from './supabase';

// ─── Auth Helpers ───────────────────────────────────────────────────

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

// ─── Comp Helpers ───────────────────────────────────────────────────

export async function fetchUserComps(userId: string) {
  // Get comps where user is a member
  const { data: memberships, error: memErr } = await supabase
    .from('comp_members')
    .select('comp_id, id')
    .eq('user_id', userId);
  if (memErr) throw memErr;
  if (!memberships || memberships.length === 0) return [];

  const compIds = memberships.map(m => m.comp_id);

  // Fetch those comps
  const { data: comps, error: compErr } = await supabase
    .from('comps')
    .select('*')
    .in('id', compIds);
  if (compErr) throw compErr;

  // Fetch members for each comp
  const { data: allMembers, error: allMemErr } = await supabase
    .from('comp_members')
    .select('id, comp_id, user_id, joined_at')
    .in('comp_id', compIds);
  if (allMemErr) throw allMemErr;

  // Fetch profiles for all members
  const memberUserIds = [...new Set((allMembers || []).map(m => m.user_id))];
  const { data: profiles, error: profErr } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', memberUserIds);
  if (profErr) throw profErr;

  const profileMap: { [id: string]: string } = {};
  (profiles || []).forEach(p => { profileMap[p.id] = p.display_name; });

  return (comps || []).map(comp => ({
    id: comp.id,
    name: comp.name,
    description: comp.description || '',
    invite_code: comp.invite_code,
    is_public: comp.is_public,
    season_year: comp.season_year,
    tip_deadline: comp.tip_deadline,
    creator_id: comp.creator_id,
    members: (allMembers || [])
      .filter(m => m.comp_id === comp.id)
      .map(m => ({
        id: m.id,
        user_id: m.user_id,
        display_name: profileMap[m.user_id] || 'Unknown',
        joined_at: m.joined_at,
      })),
  }));
}

export async function fetchPublicComps() {
  const { data: comps, error } = await supabase
    .from('comps')
    .select('*')
    .eq('is_public', true);
  if (error) throw error;

  if (!comps || comps.length === 0) return [];

  const compIds = comps.map(c => c.id);

  // Fetch member counts
  const { data: members, error: memErr } = await supabase
    .from('comp_members')
    .select('comp_id, user_id')
    .in('comp_id', compIds);
  if (memErr) throw memErr;

  // Fetch profiles for member display names
  const memberUserIds = [...new Set((members || []).map(m => m.user_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', memberUserIds.length > 0 ? memberUserIds : ['none']);

  const profileMap: { [id: string]: string } = {};
  (profiles || []).forEach(p => { profileMap[p.id] = p.display_name; });

  return comps.map(comp => ({
    id: comp.id,
    name: comp.name,
    description: comp.description || '',
    invite_code: comp.invite_code,
    is_public: comp.is_public,
    season_year: comp.season_year,
    tip_deadline: comp.tip_deadline,
    creator_id: comp.creator_id,
    members: (members || [])
      .filter(m => m.comp_id === comp.id)
      .map(m => ({
        user_id: m.user_id,
        display_name: profileMap[m.user_id] || 'Unknown',
        joined_at: '',
      })),
  }));
}

export async function fetchCompByCode(inviteCode: string) {
  const { data, error } = await supabase
    .from('comps')
    .select('*')
    .eq('invite_code', inviteCode.toUpperCase())
    .single();
  if (error) return null;
  return data;
}

export async function createComp(comp: {
  name: string;
  description: string;
  invite_code: string;
  is_public: boolean;
  creator_id: string;
  tip_deadline?: string;
}) {
  const { data, error } = await supabase
    .from('comps')
    .insert({
      name: comp.name,
      description: comp.description,
      invite_code: comp.invite_code.toUpperCase(),
      is_public: comp.is_public,
      creator_id: comp.creator_id,
      season_year: 2026,
      tip_deadline: comp.tip_deadline || null,
    })
    .select()
    .single();
  if (error) throw error;

  // Auto-join creator as first member
  await supabase
    .from('comp_members')
    .insert({ comp_id: data.id, user_id: comp.creator_id });

  return data;
}

export async function joinComp(compId: string, userId: string) {
  const { data, error } = await supabase
    .from('comp_members')
    .insert({ comp_id: compId, user_id: userId })
    .select()
    .single();
  if (error) {
    if (error.code === '23505') throw new Error('Already a member of this comp');
    throw error;
  }
  return data;
}

// ─── Tips Helpers ───────────────────────────────────────────────────

export async function getCompMemberId(compId: string, userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('comp_members')
    .select('id')
    .eq('comp_id', compId)
    .eq('user_id', userId)
    .single();
  if (error) return null;
  return data?.id || null;
}

export async function fetchTips(compMemberId: string): Promise<{ [matchId: number]: number }> {
  const { data, error } = await supabase
    .from('tips')
    .select('match_id, tipped_team_id')
    .eq('comp_member_id', compMemberId);
  if (error) throw error;

  const tipMap: { [matchId: number]: number } = {};
  (data || []).forEach(t => {
    tipMap[t.match_id] = t.tipped_team_id;
  });
  return tipMap;
}

export async function saveTips(
  compMemberId: string,
  tips: { [matchId: number]: number }
): Promise<{ saved: number; errors: number }> {
  const rows = Object.entries(tips).map(([matchId, tippedTeamId]) => ({
    comp_member_id: compMemberId,
    match_id: parseInt(matchId),
    tipped_team_id: tippedTeamId,
  }));

  if (rows.length === 0) return { saved: 0, errors: 0 };

  // Upsert in batches of 50
  let saved = 0;
  let errors = 0;
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50);
    const { error } = await supabase
      .from('tips')
      .upsert(batch, { onConflict: 'comp_member_id,match_id' });
    if (error) {
      console.error('Tips save error:', error);
      errors += batch.length;
    } else {
      saved += batch.length;
    }
  }

  return { saved, errors };
}

// ─── Leaderboard ────────────────────────────────────────────────────

export async function fetchLeaderboard(compId: string) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('comp_id', compId)
    .order('total_correct', { ascending: false });
  if (error) throw error;
  return data || [];
}
