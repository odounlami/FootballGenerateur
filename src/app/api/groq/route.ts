import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Clé Groq non configurée' },
        { status: 500 }
      );
    }
    
    console.log('⚡ Appel à Groq API...');
    
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Meilleur modèle gratuit
        messages: body.messages,
        temperature: body.temperature || 0.7,
        max_tokens: body.max_tokens || 2000,
      })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ Erreur Groq:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Erreur Groq API' },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log('✅ Réponse Groq reçue');
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Erreur serveur Groq:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}