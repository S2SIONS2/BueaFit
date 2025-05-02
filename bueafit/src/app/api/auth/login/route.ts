// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {

  try {
    const body = await req.text();

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
      credentials: 'include',
    });
    

    const resBody = await backendRes.text();

    const response = new NextResponse(resBody, {
      status: backendRes.status,
    });

    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;

  } catch (err) {
    console.error("route.ts 에러 발생:", err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
