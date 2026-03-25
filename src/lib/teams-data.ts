// AFL Teams Data - from Squiggle API

export interface AFLTeam {
  id: number;
  name: string;
  abbrev: string;
  logo: string;
}

export const AFL_TEAMS: AFLTeam[] = [
  {
    "id": 1,
    "name": "Adelaide",
    "abbrev": "ADE",
    "logo": "/wp-content/themes/squiggle/assets/images/Adelaide.png"
  },
  {
    "id": 2,
    "name": "Brisbane Lions",
    "abbrev": "BRI",
    "logo": "/wp-content/themes/squiggle/assets/images/Brisbane.png"
  },
  {
    "id": 3,
    "name": "Carlton",
    "abbrev": "CAR",
    "logo": "/wp-content/themes/squiggle/assets/images/Carlton.png"
  },
  {
    "id": 4,
    "name": "Collingwood",
    "abbrev": "COL",
    "logo": "/wp-content/themes/squiggle/assets/images/Collingwood.png"
  },
  {
    "id": 5,
    "name": "Essendon",
    "abbrev": "ESS",
    "logo": "/wp-content/themes/squiggle/assets/images/Essendon.png"
  },
  {
    "id": 6,
    "name": "Fremantle",
    "abbrev": "FRE",
    "logo": "/wp-content/themes/squiggle/assets/images/Fremantle.png"
  },
  {
    "id": 7,
    "name": "Geelong",
    "abbrev": "GEE",
    "logo": "/wp-content/themes/squiggle/assets/images/Geelong.png"
  },
  {
    "id": 8,
    "name": "Gold Coast",
    "abbrev": "GCS",
    "logo": "/wp-content/themes/squiggle/assets/images/GoldCoast.png"
  },
  {
    "id": 9,
    "name": "Greater Western Sydney",
    "abbrev": "GWS",
    "logo": "/wp-content/themes/squiggle/assets/images/Giants.png"
  },
  {
    "id": 10,
    "name": "Hawthorn",
    "abbrev": "HAW",
    "logo": "/wp-content/themes/squiggle/assets/images/Hawthorn.png"
  },
  {
    "id": 11,
    "name": "Melbourne",
    "abbrev": "MEL",
    "logo": "/wp-content/themes/squiggle/assets/images/Melbourne.png"
  },
  {
    "id": 12,
    "name": "North Melbourne",
    "abbrev": "NOR",
    "logo": "/wp-content/themes/squiggle/assets/images/NorthMelbourne.png"
  },
  {
    "id": 13,
    "name": "Port Adelaide",
    "abbrev": "POR",
    "logo": "/wp-content/themes/squiggle/assets/images/PortAdelaide.png"
  },
  {
    "id": 14,
    "name": "Richmond",
    "abbrev": "RIC",
    "logo": "/wp-content/themes/squiggle/assets/images/Richmond.png"
  },
  {
    "id": 15,
    "name": "St Kilda",
    "abbrev": "STK",
    "logo": "/wp-content/themes/squiggle/assets/images/StKilda.png"
  },
  {
    "id": 16,
    "name": "Sydney",
    "abbrev": "SYD",
    "logo": "/wp-content/themes/squiggle/assets/images/Sydney.png"
  },
  {
    "id": 17,
    "name": "West Coast",
    "abbrev": "WCE",
    "logo": "/wp-content/themes/squiggle/assets/images/WestCoast.png"
  },
  {
    "id": 18,
    "name": "Western Bulldogs",
    "abbrev": "WBD",
    "logo": "/wp-content/themes/squiggle/assets/images/Bulldogs.png"
  }
];

export function getTeamById(id: number): AFLTeam | undefined {
  return AFL_TEAMS.find(t => t.id === id);
}

export function getTeamByName(name: string): AFLTeam | undefined {
  return AFL_TEAMS.find(t => t.name === name);
}
