import { Sparkles, Target, TrendingUp, Shield, Check, ChevronRight } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export default function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-purple-200 text-sm font-medium">Propulsé par IA + API-Football</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              Générez vos
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> combinés gagnants</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              L&apos;IA utilise les vrais matchs du jour (API-Football) pour créer des combinés intelligents adaptés à votre budget
            </p>
            
            <button
              onClick={onStart}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold px-10 py-5 rounded-full hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all inline-flex items-center gap-3"
            >
              Commencer maintenant
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Section Features */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 hover:scale-105 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">API-Football</h3>
            <p className="text-gray-300 leading-relaxed">
              Données réelles : matchs, horaires, ligues en temps réel
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
              IA optimisée pour l&apos;analyse football
            </p>
          </div>
        </div>
      </div>

      {/* Section Benefits */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6">Pourquoi nous choisir ?</h2>
            <p className="text-xl text-gray-300">Des avantages concrets</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Matchs du jour analysés',
              'Cotes calculées précisément',
              'Interface simple et rapide',
              'Génération IA instantanée',
              '3 stratégies par génération',
              '100% gratuit sans inscription'
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

      {/* Section CTA Final */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Prêt à gagner ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Testez le générateur maintenant
          </p>
          <button
            onClick={onStart}
            className="bg-white text-purple-600 text-lg font-bold px-10 py-5 rounded-full hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3"
          >
            Générer mes combinés
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2026 Générateur de Combinés Football</p>
          <p className="mt-2">Jouez responsablement. Le jeu peut créer une dépendance.</p>
        </div>
      </div>
    </div>
  );
}