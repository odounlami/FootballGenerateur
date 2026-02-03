import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Liste des modèles IA gratuits à essayer (du meilleur au plus basic)
    const aiModels = [
      'meta-llama/llama-3.2-3b-instruct:free',
      'google/gemini-flash-1.5:free',
      'nousresearch/hermes-3-llama-3.1-405b:free',
      'microsoft/phi-3-mini-128k-instruct:free',
      'qwen/qwen-2-7b-instruct:free'
    ];
    
    // Essayer chaque modèle IA
    for (const model of aiModels) {
      try {
        // console.log(`Tentative avec le modèle IA: ${model}`);
        
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            'X-Title': 'Générateur de Combinés Football',
          },
          body: JSON.stringify({
            ...body,
            model: model,
            temperature: body.temperature || 0.7,
            max_tokens: body.max_tokens || 2000
          }),
        });

        if (res.ok) {
          const data = await res.json();
        //   console.log(`✅ Succès avec le modèle: ${model}`);
          return NextResponse.json(data);
        }
        
        const errorData = await res.json().catch(() => ({}));
        console.log(`❌ Échec ${model}:`, errorData.error?.message || res.status);
        
      } catch (error) {
        console.log(`❌ Erreur réseau avec ${model}:`, error);
        continue;
      }
    }
    
    // Si TOUS les modèles IA ont échoué
    console.error('❌ TOUS les modèles IA ont échoué');
    return NextResponse.json(
      { 
        error: 'Service IA temporairement indisponible. Tous les modèles sont surchargés.',
        details: 'Veuillez réessayer dans quelques minutes.'
      },
      { status: 503 }
    );
    
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}