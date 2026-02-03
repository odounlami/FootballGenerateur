export interface Match {
  match: string;
  bet: string;
  odds: string;
  kickoff?: string;
  league?: string;
}

export interface Combination {
  name: string;
  matches: Match[];
  totalOdds: string;
  potentialWin: string;
  analysis: string;
}

export interface RealMatch {
  homeTeam: string;
  awayTeam: string;
  time: string;
  league: string;
}