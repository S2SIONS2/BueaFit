import { create } from "zustand";

type Search = {
    searchParam: string;
    setSearchParam: (searchParam: string) => void;
    clearParam: () => void;
}

export const useSearchStore = create<Search>() ((set) => ({
    searchParam: '',
    setSearchParam: (searchParam) => set({ searchParam }),
    clearParam: () => set({ searchParam: '' })
}))