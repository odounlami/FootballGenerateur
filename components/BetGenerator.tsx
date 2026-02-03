'use client';

import { useState } from 'react';
import { Sparkles, AlertCircle, Check } from 'lucide-react';


import CombinationCard from './CombinationCard';
import { Combination, RealMatch } from '../types/betting';
import { fetchRealMatches, getDemoMatches } from '../services/footballApi';
import { generateCombinationsWithAI } from '../services/aiService';


export default function BetGenerator() {
  const [budget, setBudget] = useState<string>('');
  const [targetOdds, setTargetOdds] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingMatches, setFetchingMatches] = useState<boolean>(false);
  const [combinations, setCombinations] = useState<Combination[]>([]);
  const [error, setError] = useState<string>('');
  const [matchesFound, setMatchesFound] = useState<RealMatch[]>([]);

  const handleGenerate = async () => {
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
      setFetchingMatches(true);
      let realMatches: RealMatch[];

      try {
        realMatches = await fetchRealMatches();
        setMatchesFound(realMatches);
      } catch (err) {
        console.log('Erreur API-Football, utilisation matchs démo');
        realMatches = getDemoMatches();
        setMatchesFound(realMatches);
      }
      
      setFetchingMatches(false);

      if (realMatches.length === 0) {
        throw new Error('Aucun match disponible');
      }

      const validCombinations = await generateCombinationsWithAI(
        realMatches,
        budgetNum,
        oddsNum
      );

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
      setFetchingMatches(false);
    }
  };

  return (
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
          onClick={handleGenerate}
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
            <CombinationCard key={idx} combination={combo} />
          ))}
        </div>
      )}
    </div>
  );
}