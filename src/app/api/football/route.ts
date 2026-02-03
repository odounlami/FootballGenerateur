// app/api/football/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  
  if (!date) {
    return NextResponse.json({ error: 'Date manquante' }, { status: 400 });
  }
  
  const res = await fetch(
    `https://v3.football.api-sports.io/fixtures?date=${date}`,
    {
      headers: {
        'x-rapidapi-key': process.env.API_FOOTBALL_KEY!,
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
    }
  );
  
  const data = await res.json();
  return NextResponse.json(data);
} // ← Parenthèse manquante ajoutée