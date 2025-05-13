import { NextResponse } from 'next/server';

export async function GET() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    });

  const data = await response.json();
  return NextResponse.json(data);
}