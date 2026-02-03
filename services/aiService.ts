import { Combination, RealMatch } from "../types/betting";


export async function generateCombinationsWithAI(
  matches: RealMatch[],
  budget: number,
  targetOdds: number
): Promise<Combination[]> {
  const matchesData = matches.map(m => 
    `${m.homeTeam} vs ${m.awayTeam} (${m.time}, ${m.league})`
  ).join('\n');

  const response = await fetch('/api/groq', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: `Expert paris sportifs football. Crée des combinés réalistes.

RÈGLES :
1. Utilise UNIQUEMENT les matchs fournis
2. Cote totale entre ${targetOdds - 0.8} et ${targetOdds + 0.8}
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
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erreur API (${response.status})`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0]) {
    throw new Error('Réponse IA invalide');
  }

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
    throw new Error('Format JSON invalide');
  }

  const validCombinations = parsed.combinations.filter((combo: Combination) => {
    const totalOdds = parseFloat(combo.totalOdds);
    return Math.abs(totalOdds - targetOdds) <= 1.5 && combo.matches && combo.matches.length >= 3;
  });

  return validCombinations;
}