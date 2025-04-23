// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

// 검사에서 제외할 경로
const PUBLIC_PATHS = ['/', '/login', '/signup']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 공용 경로는 검사 안 함
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  // API Route 예외 처리
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Access Token 확인
  const accessToken = request.cookies.get('access_token')?.value

  // access_token 존재 시
  if (accessToken) {
    return;
  }

  // 로그인 직후 가게 선택 시
  if(pathname === '/selectstore') {
    // 선택 할 가게가 없을 때
    // 가게 선택 후
    return;
  }

  // access_token이 없으면 refresh 시도
  const refreshToken = request.cookies.get('refresh_token')?.value

  if (refreshToken) {
    try {
      // 백엔드에 토큰 갱신 요청
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('리프레시 요청:', refreshRes)

      if (refreshRes.ok) {
        const res = NextResponse.next()
        

        // 새 access token 쿠키로 설정
        const data = await refreshRes.json()
        console.log('리프레시 성공:', data)
        res.cookies.set('access_token', data.access_token, {
          httpOnly: true,
          path: '/',
        })
        
        // selectstore 페이지로 리디렉트
        return NextResponse.redirect('/selectstore')
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
  matcher: ['/((?!_next|favicon.ico).*)'], // _next 제외한 모든 경로 검사
}
