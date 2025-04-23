// import { NextRequest, NextResponse } from 'next/server';
import { cookies } from "next/headers";

export async function GET() {
    // 액세스 토큰
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/shops`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },         
          });

        return response.json();

    }catch(e){
        console.error(e)
    }
}