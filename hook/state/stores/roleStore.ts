import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Role = 'admin' | 'user' | null;

type RoleStore = {
    role: Role;
    setRole: (role: Role) => void;
};

export const useRoleStore = create<RoleStore>()(
    persist(
        (set) => ({
            role: null,
            setRole: (role) => set({ role }),
        }),
        {
            name: 'role-storage',
            storage: createJSONStorage(() => AsyncStorage), // ✅ Gunakan adapter ini
        }
    )
);
