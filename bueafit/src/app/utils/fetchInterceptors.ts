'use client';

import { useAuthStore } from "@/store/useAuthStore";

export async function fetchInterceptors(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const { access_token, setToken, clearToken } = useAuthStore.getState();
  const refresh_token = localStorage.getItem("refresh_token");

  // ✅ 최초 요청
  const withAuthInit: RequestInit = {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(access_token ? { Authorization: `Bearer ${access_token}` } : {}),
    },
    credentials: "include",
  };

  const response = await fetch(input, withAuthInit);

  // ✅ 401 아닌 경우 → 그대로 반환
  if (response.status !== 401 || (input as string).includes(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/refresh`)) {
    return response;
  }

  // ✅ 리프레시 시도
  try {
    const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/refresh`, {
      method: "POST",
      headers: {
        "X-Refresh-Token": refresh_token ?? "",
      },
      credentials: "include",
    });

    if (!refreshResponse.ok) {
      throw new Error("리프레시 실패");
    }

    const refreshData = await refreshResponse.json();
    const newAccessToken = refreshData.access_token;
    const newRefreshToken = refreshData.refresh_token;

    // ✅ 상태/로컬스토리지 갱신
    setToken(newAccessToken);
    localStorage.setItem("refresh_token", newRefreshToken);

    // ✅ 원래 요청 재시도
    const retryInit: RequestInit = {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${newAccessToken}`,
      },
      credentials: "include",
    };

    return await fetch(input, retryInit);
  } catch (e) {
    // ✅ 리프레시 실패 시 로그아웃 처리
    clearToken();
    if (typeof window !== "undefined") {
    //   window.location.href = "/login";
    }
    throw e;
  }
}
