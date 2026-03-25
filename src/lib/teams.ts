export const AFL_TEAM_COLORS: Record<string, { primary: string; secondary: string }> = {
  'Adelaide': { primary: '#002B5C', secondary: '#FFD200' },
  'Brisbane Lions': { primary: '#A30046', secondary: '#0054A4' },
  'Carlton': { primary: '#0E1E2D', secondary: '#FFFFFF' },
  'Collingwood': { primary: '#000000', secondary: '#FFFFFF' },
  'Essendon': { primary: '#CC2031', secondary: '#000000' },
  'Fremantle': { primary: '#2A0D45', secondary: '#FFFFFF' },
  'Geelong': { primary: '#001F3D', secondary: '#FFFFFF' },
  'Gold Coast': { primary: '#CF2031', secondary: '#FFD200' },
  'GWS': { primary: '#F47920', secondary: '#3D3B3A' },
  'Hawthorn': { primary: '#4D2004', secondary: '#FFB800' },
  'Melbourne': { primary: '#0F1131', secondary: '#CC2031' },
  'North Melbourne': { primary: '#003C71', secondary: '#FFFFFF' },
  'Port Adelaide': { primary: '#008AAB', secondary: '#000000' },
  'Richmond': { primary: '#000000', secondary: '#FFD200' },
  'St Kilda': { primary: '#ED0F05', secondary: '#000000' },
  'Sydney': { primary: '#ED171F', secondary: '#FFFFFF' },
  'West Coast': { primary: '#002B5C', secondary: '#F2A900' },
  'Western Bulldogs': { primary: '#014896', secondary: '#CC2031' },
};

export function getTeamColor(teamName: string): string {
  for (const [name, colors] of Object.entries(AFL_TEAM_COLORS)) {
    if (teamName.includes(name)) return colors.primary;
  }
  return '#6366f1';
}
