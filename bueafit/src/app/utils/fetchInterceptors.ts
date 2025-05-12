'use client';

import { useAuthStore } from "@/store/useAuthStore";

export async function fetchInterceptors(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const token = useAuthStore.getState().access_token;
  const setToken = useAuthStore.getState().setToken;
  const clearToken = useAuthStore.getState().clearToken;

  const modifiedInit: RequestInit = {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include', // 쿠키 - 리프레시 토큰 전달
  };

  const response = await fetch(input, modifiedInit);

  // 401 처리 및 리프레시
  if (response.status === 401) { // && !input.toString().includes('/auth/refresh')
    try {
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      console.log(refreshRes)

      if (!refreshRes.ok) throw new Error('Refresh failed');

      const data = await refreshRes.json();
      const newAccessToken = data.access_token;
      setToken(newAccessToken);

      // 원래 요청 재시도
      const retryResponse = await fetch(input, {
        ...modifiedInit,
        headers: {
          ...(init?.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        },
        credentials: 'include',
      });

      return retryResponse;
    } catch (err) {
      clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw err;
    }
  }

  return response;
}
