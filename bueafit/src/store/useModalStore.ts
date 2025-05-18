import { create } from "zustand";
import { ReactNode } from "react";

interface ModalState {
  isOpen: boolean;
  component: ReactNode | null;
  openModal: (component: ReactNode) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  component: null,
  openModal: (component) => set({ isOpen: true, component }),
  closeModal: () => set({ isOpen: false, component: null }),
}));
