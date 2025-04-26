// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from "next/headers";

// 검사에서 제외할 경로
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API Route 예외 처리
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // if (pathname === ('/api/auth/login')) {
  //   return NextResponse.next();
  // }

  // Access Token 확인
  const accessToken = request.cookies.get('access_token')?.value

  // access_token 존재 시
  if (accessToken) {
    return;
  }

  // access_token이 없으면 refresh 시도
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  const cookie = request.headers.get('cookie') || '';

  if (refreshToken) {
    try {
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookie,
        },
      });

      if (refreshRes.ok) {
        const res = NextResponse.next()

        // 새 access token 쿠키로 설정
        const data = await refreshRes.json()
        res.cookies.set('access_token', data.access_token, {
          httpOnly: true,
          path: '/',
        })
        
        return res;
      }
    } catch (e) {
      console.error('리프레시 에러:', e)
    }
  }
  
  // 리프레시 실패 → 로그인 페이지로 리디렉트
  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/login'
  return NextResponse.redirect(loginUrl)
}

// 미들웨어가 동작할 경로 설정
export const config = {
  matcher: [
    '/((?!_next|favicon.ico|login|signup).*)',
    '/', 
  ],
}