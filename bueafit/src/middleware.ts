// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const access_token = request.cookies.get('access_token')?.value // 액세스 토큰
  const refresh_token = request.cookies.get('refresh_token')?.value // 리프레시 토큰

  // access 토큰만 없으면 리프레시 토큰으로 재발급
  if (!access_token && refresh_token) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/refreshing'
    url.searchParams.set('to', pathname)
    return NextResponse.redirect(url)
  }

  // 둘 다 없으면 로그인 페이지로
  if (!access_token && !refresh_token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 액세스 토큰이 있으면 통과
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/', 
    '/((?!_next|favicon\\.ico|login|signup|api|auth/refreshing).*)'
  ],
}
