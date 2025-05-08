'use client';

import { create } from "zustand";

interface Shop {
    id: number;
    name: string;
}
interface ShopState {
    loading: boolean;
    shopList: Shop[];
    fetchShopList: () => Promise<void>;
}

export const useShopStore = create<ShopState>((set) => ({
    shopList: [],
    loading: false,
    error: null,
    fetchShopList: async () => {
        set({ loading: true });
    
        try {
            const response = await fetch('/api/shop', {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                const error = await response.json();
                console.error("응답 에러:", error);
                throw new Error(error.detail || 'API 호출 실패');
            }
    
            const data = await response.json();
            set({ shopList: data, loading: false });
        } catch (e) {
            console.error("fetchShopList 실패", e);
            set({ loading: false });
        }
    }    
}))