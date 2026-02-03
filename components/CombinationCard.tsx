import { Combination } from "../types/betting";


interface Props {
  combination: Combination;
}

export default function CombinationCard({ combination }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-white">{combination.name}</h3>
        <div className="text-right">
          <div className="text-sm text-purple-300">Cote totale</div>
          <div className="text-3xl font-bold text-green-400">{combination.totalOdds}</div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {combination.matches && combination.matches.map((match, mIdx) => (
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
          <span className="text-green-400 font-bold text-2xl">{combination.potentialWin}</span>
        </div>
      </div>

      <div className="bg-purple-900/30 rounded-lg p-4">
        <div className="text-sm text-purple-300 font-semibold mb-1">Analyse :</div>
        <div className="text-purple-200 text-sm">{combination.analysis}</div>
      </div>
    </div>
  );
}