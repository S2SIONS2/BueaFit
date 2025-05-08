// /app/api/shop/route.ts

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('access_token')?.value;

  const response = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}
