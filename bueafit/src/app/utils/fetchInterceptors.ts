'use client';

import { useAuthStore } from "@/store/useAuthStore";

export async function fetchInterceptors(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const token = useAuthStore.getState().access_token;
    const setToken = useAuthStore.getState().setToken;
    const clearToken = useAuthStore.getState().clearToken;

    // localstorage의 리프레시 토큰
    const refresh_token = localStorage.getItem('refresh_token')

    // 기존
    const modifiedInit: RequestInit = {
        ...init,
        headers: {
        ...(init?.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include', // 쿠키 - 리프레시 토큰 전달
    };

    const response = await fetch(input, modifiedInit);
    // const data = await response.json();

    // 401 처리 및 리프레시
    if (response.status === 401) {
        try {
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/refresh`, {
            method: 'POST',
            headers: {
            'X-Refresh-Token' : refresh_token ?? ''
            },
            credentials: 'include',
        });      

        if (!refreshRes.ok) throw new Error('Refresh failed');

        const data = await refreshRes.json();
        const newAccessToken = data.access_token; // 새 액세스 토큰 발급
        localStorage.setItem('refresh_token', data.refresh_token) // 리프레시 토큰 로컬 스토리지에 저장
        setToken(newAccessToken); // 새 액세스 토큰 주스탠드(메모리)에 저장

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
        
        }catch (err) {
            clearToken();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            throw err;
        }
    }

    return response;
}
