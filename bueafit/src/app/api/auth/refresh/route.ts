// app/api/auth/refresh/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try{
    // 1) 쿠키 스토어 가져오기
    const cookieStore = await cookies()

    const refreshToken = cookieStore.get('refresh_token')?.value
    if (!refreshToken) {
      console.error('[auth/refresh] no refresh_token cookie')
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
    }

    // 2) FastAPI 재발급 요청
    const backendUrl = `${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/refresh`
    const backendRes = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',      
        Cookie: `refresh_token=${refreshToken}`,
      },
    })

    // 3) 디버그: 백엔드 응답 확인
    const text = await backendRes.text()

    if (!backendRes.ok) {
      return NextResponse.json({ error: 'Refresh failed' }, { status: backendRes.status })
    }

    // 4) 성공 시 JSON 파싱 및 access_token 덮어쓰기
    const { access_token, refresh_token: newRefresh } = JSON.parse(text)
    cookieStore.set('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15,
    })

    // 5) 백엔드가 새 refresh_token도 내려주면 덮어쓰기
    if (newRefresh) {
      cookieStore.set('refresh_token', newRefresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    return NextResponse.json({ access_token })

  }catch(e){
    console.error(e)
    fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}
