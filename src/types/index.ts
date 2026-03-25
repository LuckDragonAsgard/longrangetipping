export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Comp {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  is_public: boolean;
  invite_code: string;
  season_year: number;
  tip_deadline: string;
  created_at: string;
  member_count?: number;
  creator?: User;
}

export interface CompMember {
  id: string;
  comp_id: string;
  user_id: string;
  joined_at: string;
  user?: User;
  total_points?: number;
  total_correct?: number;
  total_tipped?: number;
}

export interface Team {
  id: number;
  name: string;
  short_name: string;
  logo_url?: string;
}

export interface Round {
  id: number;
  season_year: number;
  round_number: number;
  name: string;
  start_date: string;
}

export interface Match {
  id: number;
  round_id: number;
  round_number?: number;
  home_team_id: number;
  away_team_id: number;
  venue: string;
  start_time: string;
  home_score?: number;
  away_score?: number;
  winner_team_id?: number;
  is_complete: boolean;
  home_team?: Team;
  away_team?: Team;
}

export interface Tip {
  id: string;
  comp_member_id: string;
  match_id: number;
  tipped_team_id: number;
  is_correct?: boolean;
  points: number;
  match?: Match;
  tipped_team?: Team;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  total_points: number;
  total_correct: number;
  total_tipped: number;
  accuracy: number;
}
