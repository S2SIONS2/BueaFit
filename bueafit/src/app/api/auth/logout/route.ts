import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("access_token")?.value;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (response.status === 200) {
      return redirect("/login");
    }

    return NextResponse.json({ message: "로그아웃 실패", status: response.status });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "로그아웃 중 오류 발생" }, { status: 500 });
  }
}
