import { create } from 'zustand'

type Auth = {
    access_token: string | null;
    setToken: (access_token: string)=> void;
    clearToken: () => void;
}

export const useAuthStore = create<Auth>()((set) => ({
    access_token: null,
    setToken: (access_token) => set({ access_token }),
    clearToken: () => set({access_token: null})
}))
