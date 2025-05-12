import { useAuthStore } from '@/store/useAuthStore';
import { NextResponse } from 'next/server';

export async function GET() {
    const token = useAuthStore.getState().access_token;
    const response = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        },
    });

  const data = await response.json();
  return NextResponse.json(data);
}