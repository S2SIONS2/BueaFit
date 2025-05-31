import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      return NextResponse.json({ message: "로그아웃 실패", status: response.status });
    }

    if (response.status === 200) {
      const res = NextResponse.json({ redirect: "/login" });

      res.cookies.set("access_token", "", {
        path: "/",
        maxAge: 0,
      });

      res.cookies.set("refresh_token", "", {
        path: "/",
        maxAge: 0,
      });

      return res;
    }
    return NextResponse.redirect(new URL("/login", request.url));

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "로그아웃 중 오류 발생" }, { status: 500 });
  }
}
