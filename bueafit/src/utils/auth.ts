"use client"; // client 전용

import { cookies } from "next/headers"; // server용 cookies는 서버컴포넌트 안에서만 사용 가능

// 🛡️ 서버용 Access Token 가져오기
export async function getAccessTokenServer() {
  const cookieStore = cookies();
  return (await cookieStore).get("access_token")?.value || null;
}

// 🛡️ 서버용 Refresh Token 가져오기
export async function getRefreshTokenServer() {
  const cookieStore = cookies();
  return (await cookieStore).get("refresh_token")?.value || null;
}
