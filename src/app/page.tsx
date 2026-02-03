'use client';

import { useState } from 'react';
import BetGenerator from '../../components/BetGenerator';
import LandingPage from '../../components/LandingPage';


export default function FootballBetPage() {
  const [showGenerator, setShowGenerator] = useState<boolean>(false);

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
          <BetGenerator />
        </div>
      </div>
    );
  }

  return <LandingPage onStart={() => setShowGenerator(true)} />;
}