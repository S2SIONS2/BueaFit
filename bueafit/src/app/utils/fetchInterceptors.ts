'use client';

import { useAuthStore } from "@/store/useAuthStore";

// 리프레시 토큰 요청 Promise를 전역에 저장
let refreshTokenPromise: Promise<{ access_token: string; refresh_token: string }> | null = null;

export async function fetchInterceptors(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const { access_token, setToken, clearToken } = useAuthStore.getState();
  const refresh_token = sessionStorage.getItem("refresh_token");

  // 최초 요청
  const withAuthInit: RequestInit = {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(access_token ? { Authorization: `Bearer ${access_token}` } : {}),
    },
    credentials: "include",
  };

  const response = await fetch(input, withAuthInit);

  // 정상 응답 또는 refresh 요청이면 그대로 반환
  if (response.status !== 401 || (input as string).includes("/auth/refresh")) {
    return response;
  }

  // 중복 리프레시 방지: 이미 요청 중이면 기존 Promise 반환받아 기다림
  if (!refreshTokenPromise) {
    refreshTokenPromise = fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/refresh`, {
      method: "POST",
      headers: {
        "X-Refresh-Token": refresh_token ?? "",
      },
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("리프레시 실패");
        const data = await res.json();
        setToken(data.access_token);
        sessionStorage.setItem("refresh_token", data.refresh_token);
        return data;
      })
      .finally(() => {
        refreshTokenPromise = null; // 끝난 후 초기화
      });
  }

  try {
    const { access_token: newToken } = await refreshTokenPromise;

    // 새 토큰으로 원래 요청 재시도
    const retryInit: RequestInit = {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${newToken}`,
      },
      credentials: "include",
    };

    return await fetch(input, retryInit);
  } catch (err) {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw err;
  }
}
