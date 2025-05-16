import { create } from 'zustand';

type CustomerModalStore = {
  isOpen: boolean;
  mode: 'create' | 'edit';
  data: any;
  openCreate: () => void;
  openEdit: (data: any) => void;
  close: () => void;
};

export const useModalStore = create<CustomerModalStore>((set) => ({
  isOpen: false,
  mode: 'create',
  data: null,
  openCreate: () => set({ isOpen: true, mode: 'create', data: null }),
  openEdit: (data) => set({ isOpen: true, mode: 'edit', data }),
  close: () => set({ isOpen: false, data: null }),
}));
