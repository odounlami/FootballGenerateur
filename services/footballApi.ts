import { RealMatch } from "../types/betting";


const TOP_LEAGUE_IDS = [39, 140, 61, 78, 135, 2, 3, 848, 45, 143, 66, 81, 137];

const TOP_CLUBS = [
  'Arsenal', 'Manchester City', 'Liverpool', 'Manchester United', 'Chelsea', 'Tottenham', 'Newcastle',
  'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla', 'Real Sociedad',
  'PSG', 'Marseille', 'Lyon', 'Monaco', 'Lille', 'Nice', 'Lens',
  'Bayern Munich', 'Dortmund', 'RB Leipzig', 'Bayer Leverkusen', 'Union Berlin',
  'Inter', 'AC Milan', 'Juventus', 'Napoli', 'Roma', 'Lazio', 'Atalanta'
];

export async function fetchRealMatches(): Promise<RealMatch[]> {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  const response = await fetch(`/api/football?date=${dateStr}`);

  if (!response.ok) {
    throw new Error('Erreur API-Football');
  }

  const data = await response.json();
  
  if (!data.response || data.response.length === 0) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const responseTomorrow = await fetch(`/api/football?date=${tomorrowStr}`);
    
    if (responseTomorrow.ok) {
      const dataTomorrow = await responseTomorrow.json();
      if (dataTomorrow.response && dataTomorrow.response.length > 0) {
        data.response = dataTomorrow.response;
      }
    }
    
    if (!data.response || data.response.length === 0) {
      throw new Error('Aucun match trouvé');
    }
  }

  const matches: RealMatch[] = data.response
    .filter((fixture: any) => TOP_LEAGUE_IDS.includes(fixture.league.id))
    .map((fixture: any) => {
      const kickoffDate = new Date(fixture.fixture.date);
      const hours = kickoffDate.getHours().toString().padStart(2, '0');
      const minutes = kickoffDate.getMinutes().toString().padStart(2, '0');
      
      const homeTeam = fixture.teams.home.name;
      const awayTeam = fixture.teams.away.name;
      
      const popularityScore = 
        (TOP_CLUBS.some(club => homeTeam.includes(club)) ? 1 : 0) +
        (TOP_CLUBS.some(club => awayTeam.includes(club)) ? 1 : 0);
      
      return {
        homeTeam,
        awayTeam,
        time: `${hours}:${minutes}`,
        league: fixture.league.name,
        popularityScore
      };
    })
    .sort((a: any, b: any) => b.popularityScore - a.popularityScore)
    .slice(0, 20)
    .map(({ popularityScore, ...match }: any) => match);

  if (matches.length === 0) {
    const anyMatches: RealMatch[] = data.response
      .slice(0, 15)
      .map((fixture: any) => {
        const kickoffDate = new Date(fixture.fixture.date);
        const hours = kickoffDate.getHours().toString().padStart(2, '0');
        const minutes = kickoffDate.getMinutes().toString().padStart(2, '0');
        
        return {
          homeTeam: fixture.teams.home.name,
          awayTeam: fixture.teams.away.name,
          time: `${hours}:${minutes}`,
          league: fixture.league.name
        };
      });
    
    if (anyMatches.length > 0) {
      return anyMatches;
    }
    
    throw new Error('Aucun match disponible');
  }

  return matches;
}

export function getDemoMatches(): RealMatch[] {
  return [
    { homeTeam: 'Arsenal', awayTeam: 'Manchester United', time: '18:30', league: 'Premier League' },
    { homeTeam: 'PSG', awayTeam: 'Marseille', time: '21:00', league: 'Ligue 1' },
    { homeTeam: 'Bayern Munich', awayTeam: 'Dortmund', time: '20:30', league: 'Bundesliga' },
    { homeTeam: 'Real Madrid', awayTeam: 'Barcelona', time: '21:00', league: 'La Liga' },
    { homeTeam: 'Inter Milan', awayTeam: 'Juventus', time: '20:45', league: 'Serie A' },
    { homeTeam: 'Liverpool', awayTeam: 'Chelsea', time: '16:00', league: 'Premier League' },
    { homeTeam: 'Manchester City', awayTeam: 'Tottenham', time: '17:30', league: 'Premier League' },
    { homeTeam: 'Lyon', awayTeam: 'Monaco', time: '19:00', league: 'Ligue 1' }
  ];
}