/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { Sparkles, Target, TrendingUp, Shield, Check, ChevronRight, AlertCircle, Search, Key } from 'lucide-react';

interface Match {
  match: string;
  bet: string;
  odds: string;
  kickoff?: string;
  league?: string;
}

interface Combination {
  name: string;
  matches: Match[];
  totalOdds: string;
  potentialWin: string;
  analysis: string;
}

interface RealMatch {
  homeTeam: string;
  awayTeam: string;
  time: string;
  league: string;
}

export default function FootballBetGenerator() {
  const [budget, setBudget] = useState<string>('');
  const [targetOdds, setTargetOdds] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingMatches, setFetchingMatches] = useState<boolean>(false);
  const [combinations, setCombinations] = useState<Combination[]>([]);
  const [error, setError] = useState<string>('');
  const [showGenerator, setShowGenerator] = useState<boolean>(false);
  const [matchesFound, setMatchesFound] = useState<RealMatch[]>([]);
  const [apiKey, setApiKey] = useState<string>('9bf103ef0a49957cb8af5b0b6f531144');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  // Fonction pour récupérer les matchs via API-Football
  const fetchRealMatchesFromAPI = async (apiKeyToUse: string): Promise<RealMatch[]> => {
    setFetchingMatches(true);
    try {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
      
      // Appel à API-Football pour TOUS les matchs du jour
      const response = await fetch(`https://v3.football.api-sports.io/fixtures?date=${dateStr}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKeyToUse,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur API-Football. Vérifiez votre clé API.');
      }

      const data = await response.json();
      
      if (!data.response || data.response.length === 0) {
        // Si aucun match aujourd'hui, essayer demain
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        const responseTomorrow = await fetch(`https://v3.football.api-sports.io/fixtures?date=${tomorrowStr}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-key': apiKeyToUse,
            'x-rapidapi-host': 'v3.football.api-sports.io'
          }
        });
        
        if (responseTomorrow.ok) {
          const dataTomorrow = await responseTomorrow.json();
          if (dataTomorrow.response && dataTomorrow.response.length > 0) {
            data.response = dataTomorrow.response;
          }
        }
        
        if (!data.response || data.response.length === 0) {
          throw new Error('Aucun match trouvé aujourd\'hui ni demain');
        }
      }

      // IDs des ligues principales
      const topLeagueIds = [39, 140, 61, 78, 135, 2, 3, 848, 45, 143, 66, 81, 137];
      
      // Top clubs par ligue pour prioriser les matchs populaires
      const topClubs = [
        // Premier League
        'Arsenal', 'Manchester City', 'Liverpool', 'Manchester United', 'Chelsea', 'Tottenham', 'Newcastle',
        // La Liga
        'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla', 'Real Sociedad',
        // Ligue 1
        'PSG', 'Marseille', 'Lyon', 'Monaco', 'Lille', 'Nice', 'Lens',
        // Bundesliga
        'Bayern Munich', 'Dortmund', 'RB Leipzig', 'Bayer Leverkusen', 'Union Berlin',
        // Serie A
        'Inter', 'AC Milan', 'Juventus', 'Napoli', 'Roma', 'Lazio', 'Atalanta'
      ];

      const matches: RealMatch[] = data.response
        .filter((fixture: any) => {
          // Filtrer par ID de ligue
          return topLeagueIds.includes(fixture.league.id);
        })
        .map((fixture: any) => {
          const kickoffDate = new Date(fixture.fixture.date);
          const hours = kickoffDate.getHours().toString().padStart(2, '0');
          const minutes = kickoffDate.getMinutes().toString().padStart(2, '0');
          
          const homeTeam = fixture.teams.home.name;
          const awayTeam = fixture.teams.away.name;
          
          // Score de popularité (0-2 : 0 = pas top club, 1 = 1 top club, 2 = 2 top clubs)
          const popularityScore = 
            (topClubs.some(club => homeTeam.includes(club)) ? 1 : 0) +
            (topClubs.some(club => awayTeam.includes(club)) ? 1 : 0);
          
          return {
            homeTeam,
            awayTeam,
            time: `${hours}:${minutes}`,
            league: fixture.league.name,
            popularityScore
          };
        })
        // Trier par popularité d'abord (matchs avec top clubs en premier)
        .sort((a: any, b: any) => b.popularityScore - a.popularityScore)
        .slice(0, 20) // Prendre top 20 matchs
        .map(({ popularityScore, ...match }: any) => match); // Retirer le score de popularité

      if (matches.length === 0) {
        // Si aucun match des grandes ligues, prendre n'importe quels matchs
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
          setMatchesFound(anyMatches);
          return anyMatches;
        }
        
        throw new Error('Aucun match disponible');
      }

      setMatchesFound(matches);
      return matches;
      
    } catch (error) {
      console.error('Erreur API-Football:', error);
      throw error;
    } finally {
      setFetchingMatches(false);
    }
  };

  // Matchs de démo si pas d'API key
  const getDemoMatches = (): RealMatch[] => {
    const demoMatches: RealMatch[] = [
      { homeTeam: 'Arsenal', awayTeam: 'Manchester United', time: '18:30', league: 'Premier League' },
      { homeTeam: 'PSG', awayTeam: 'Marseille', time: '21:00', league: 'Ligue 1' },
      { homeTeam: 'Bayern Munich', awayTeam: 'Dortmund', time: '20:30', league: 'Bundesliga' },
      { homeTeam: 'Real Madrid', awayTeam: 'Barcelona', time: '21:00', league: 'La Liga' },
      { homeTeam: 'Inter Milan', awayTeam: 'Juventus', time: '20:45', league: 'Serie A' },
      { homeTeam: 'Liverpool', awayTeam: 'Chelsea', time: '16:00', league: 'Premier League' },
      { homeTeam: 'Manchester City', awayTeam: 'Tottenham', time: '17:30', league: 'Premier League' },
      { homeTeam: 'Lyon', awayTeam: 'Monaco', time: '19:00', league: 'Ligue 1' }
    ];
    
    setMatchesFound(demoMatches);
    return demoMatches;
  };

  const generateCombinations = async () => {
    if (!budget || !targetOdds) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const budgetNum = parseFloat(budget);
    const oddsNum = parseFloat(targetOdds);

    if (budgetNum <= 0 || budgetNum > 1000) {
      setError('Budget doit être entre 1€ et 1000€');
      return;
    }

    if (oddsNum < 2.0 || oddsNum > 50.0) {
      setError('Cote cible doit être entre 2.0 et 50.0');
      return;
    }

    setLoading(true);
    setError('');
    setCombinations([]);

    try {
      let realMatches: RealMatch[];

      // Récupérer les matchs (API ou démo)
      if (apiKey && apiKey.length > 10) {
        try {
          realMatches = await fetchRealMatchesFromAPI(apiKey);
        } catch (err) {
          setError('Erreur API-Football. Utilisation des matchs de démo.');
          realMatches = getDemoMatches();
        }
      } else {
        realMatches = getDemoMatches();
      }

      if (realMatches.length === 0) {
        throw new Error('Aucun match disponible');
      }

      const matchesData = realMatches.map(m => 
        `${m.homeTeam} vs ${m.awayTeam} (${m.time}, ${m.league})`
      ).join('\n');

      // Fonction helper pour retry avec délai
      const fetchWithRetry = async (url: string, options: any, maxRetries = 5) => {
        for (let i = 0; i < maxRetries; i++) {
          try {
            const response = await fetch(url, options);
            
            if (response.status === 429) {
              // Rate limit, attendre plus longtemps
              const waitTime = Math.min(Math.pow(2, i) * 3000, 30000); // 3s, 6s, 12s, 24s, 30s max
              console.log(`⏳ Rate limit détecté. Attente de ${waitTime/1000}s avant nouvelle tentative...`);
              setError(`⏳ Trop de requêtes. Nouvelle tentative dans ${waitTime/1000}s...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              setError(''); // Effacer le message avant retry
              continue;
            }
            
            return response;
          } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
        throw new Error('OpenRouter est temporairement surchargé. Attendez 2-3 minutes et réessayez.');
      };

      // Génération des combinés avec Claude
      const response = await fetchWithRetry('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
          'HTTP-Referer': window.location.href,
          'X-Title': 'Générateur de Combinés Football'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-exp:free',
          messages: [
            {
              role: 'system',
              content: `Expert paris sportifs football. Crée des combinés réalistes.

RÈGLES :
1. Utilise UNIQUEMENT les matchs fournis
2. Cote totale entre ${oddsNum - 0.8} et ${oddsNum + 0.8}
3. Paris : 1X2, BTTS, Over/Under, Double Chance
4. Cotes individuelles : 1.25 à 3.50
5. 3 combinés : Sécurité, Équilibré, Risqué`
            },
            {
              role: 'user',
              content: `MATCHS :
${matchesData}

Génère 3 combinés :
- Budget : ${budget}€
- Cote : ${targetOdds}

JSON (sans markdown) :
{
  "combinations": [
    {
      "name": "Combiné Sécurité",
      "matches": [{"match": "Arsenal vs Man United", "bet": "Arsenal (1)", "odds": "1.85", "kickoff": "18:30", "league": "Premier League"}],
      "totalOdds": "5.2",
      "potentialWin": "52.00€",
      "analysis": "Arsenal domine à domicile."
    }
  ]
}`
            }
          ],
          temperature: 0.5,
          max_tokens: 2000
        })
      });

      if (!response) {
        throw new Error('Erreur génération IA');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error('⏳ Limite de requêtes atteinte. Attendez 2-3 minutes puis réessayez. OpenRouter limite les appels gratuits à ~10/minute.');
        }
        throw new Error(errorData.error?.message || 'Erreur génération IA');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      let jsonContent = content.trim()
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '');
      
      const jsonMatch = jsonContent.match(/\{[\s\S]*"combinations"[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
      }
      
      const parsed = JSON.parse(jsonContent);
      
      if (!parsed.combinations || !Array.isArray(parsed.combinations)) {
        throw new Error('Format invalide');
      }

      const validCombinations = parsed.combinations.filter((combo: Combination) => {
        const totalOdds = parseFloat(combo.totalOdds);
        return Math.abs(totalOdds - oddsNum) <= 1.5 && combo.matches && combo.matches.length >= 3;
      });

      if (validCombinations.length === 0) {
        setError(`Impossible de générer pour cote ${targetOdds}. Essayez 2.0-15.0`);
      } else {
        setCombinations(validCombinations);
      }
      
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Erreur génération');
    } finally {
      setLoading(false);
    }
  };

  if (showGenerator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => setShowGenerator(false)}
            className="mb-6 text-white hover:text-purple-300 transition-colors flex items-center gap-2"
          >
            ← Retour
          </button>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6">Générateur de Combinés IA</h2>
              
              <div className="mb-6 bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-200">
                    <strong>Mode actuel :</strong> ✅ API-Football activée (matchs réels des top clubs)
                  </div>
                </div>
              </div>

              {matchesFound.length > 0 && (
                <div className="mb-6 bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                  <div className="flex gap-2 items-start">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-200">
                      <strong>{matchesFound.length} matchs trouvés :</strong> {matchesFound.slice(0, 3).map(m => `${m.homeTeam}-${m.awayTeam}`).join(', ')}
                      {matchesFound.length > 3 && '...'}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white mb-2 font-medium">Budget (€)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Ex: 10"
                    min="1"
                    max="1000"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Entre 1€ et 1000€</p>
                </div>
                
                <div>
                  <label className="block text-white mb-2 font-medium">Cote Cible</label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetOdds}
                    onChange={(e) => setTargetOdds(e.target.value)}
                    placeholder="Ex: 5.0"
                    min="2"
                    max="50"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Entre 2.0 et 50.0</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={generateCombinations}
                disabled={loading || fetchingMatches}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {fetchingMatches ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Récupération matchs API-Football...
                  </>
                ) : loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Génération IA... (peut prendre 5-10s)
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Générer mes combinés
                  </>
                )}
              </button>
            </div>

            {combinations.length > 0 && (
              <div className="space-y-6">
                {combinations.map((combo, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-white">{combo.name}</h3>
                      <div className="text-right">
                        <div className="text-sm text-purple-300">Cote totale</div>
                        <div className="text-3xl font-bold text-green-400">{combo.totalOdds}</div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {combo.matches && combo.matches.map((match, mIdx) => (
                        <div key={mIdx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="text-white font-medium">{match.match}</div>
                              <div className="text-purple-300 text-sm">{match.bet}</div>
                              <div className="flex gap-3 mt-1 flex-wrap">
                                {match.kickoff && (
                                  <div className="text-green-400 text-xs">🕐 {match.kickoff}</div>
                                )}
                                {match.league && (
                                  <div className="text-blue-400 text-xs">🏆 {match.league}</div>
                                )}
                              </div>
                            </div>
                            <div className="text-green-400 font-bold text-lg ml-4">{match.odds}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/20 pt-4 mb-4">
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-white">Gain potentiel :</span>
                        <span className="text-green-400 font-bold text-2xl">{combo.potentialWin}</span>
                      </div>
                    </div>

                    <div className="bg-purple-900/30 rounded-lg p-4">
                      <div className="text-sm text-purple-300 font-semibold mb-1">Analyse :</div>
                      <div className="text-purple-200 text-sm">{combo.analysis}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-purple-200 text-sm font-medium">Propulsé par Claude AI + API-Football</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              Générez vos
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> combinés gagnants</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              L'IA utilise les vrais matchs du jour (API-Football) pour créer des combinés intelligents adaptés à votre budget
            </p>
            
            <button
              onClick={() => setShowGenerator(true)}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold px-10 py-5 rounded-full hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all inline-flex items-center gap-3"
            >
              Commencer maintenant
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 hover:scale-105 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">API-Football</h3>
            <p className="text-gray-300 leading-relaxed">
              Données réelles via API-Football : matchs, horaires, ligues en temps réel
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 hover:scale-105 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Cotes Précises</h3>
            <p className="text-gray-300 leading-relaxed">
              Calcul exact pour atteindre votre cote cible (±0.8)
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 hover:scale-105 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">IA Spécialisée</h3>
            <p className="text-gray-300 leading-relaxed">
              Claude optimisé pour l'analyse football et paris sportifs
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6">Pourquoi nous choisir ?</h2>
            <p className="text-xl text-gray-300">Des avantages concrets</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Matchs réels via API-Football',
              'Mode gratuit avec matchs démo',
              'Cotes calculées précisément',
              'Interface simple et rapide',
              'Génération IA instantanée',
              '3 stratégies par génération'
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-white text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Prêt à gagner ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Testez gratuitement avec matchs démo ou activez API-Football
          </p>
          <button
            onClick={() => setShowGenerator(true)}
            className="bg-white text-purple-600 text-lg font-bold px-10 py-5 rounded-full hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3"
          >
            Générer mes combinés
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2026 Générateur de Combinés Football </p>
          <p className="mt-2">Jouez responsablement. Le jeu peut créer une dépendance.</p>
        </div>
      </div>
    </div>
  );
}