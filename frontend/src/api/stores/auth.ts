"use client"

import { createStore, useStore } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Role, UserInfo } from '@/generated/auth/auth';
import { useCallback } from 'react';
import { useLogoutMutation } from '@/api/mutations/authMutations';

type User = UserInfo;

export interface AuthStore {
    user: User | null;
    isInitialized: boolean;
    hasHydrated: boolean;
    setUser: (user: User | null) => void;
    setInitialized: (initialized: boolean) => void;
    setHasHydrated: (hasHydrated: boolean) => void;
    logout: () => void;
}

export const authStore = createStore<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isInitialized: false,
            hasHydrated: false,
            setUser: (user) => set({ user }),
            setInitialized: (initialized) => set({ isInitialized: initialized }),
            setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'ws-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);

export function useAuthStore(): AuthStore;
export function useAuthStore<T>(selector: (state: AuthStore) => T): T;
export function useAuthStore<T>(selector?: (state: AuthStore) => T) {
    return useStore(authStore, selector!);
}

export function useAuth() {
    const user = useAuthStore((s) => s.user);
    const isInitialized = useAuthStore((s) => s.isInitialized);
    const hasHydrated = useAuthStore((s) => s.hasHydrated);

    const isAuthed = !!user && hasHydrated;
    const isAdmin = user?.role === Role.ADMIN;

    const logoutMutation = useLogoutMutation();

    const logout = useCallback(() => {
        logoutMutation.mutate();
    }, [logoutMutation]);

    return {
        user, isAuthed, isAdmin, isInitialized, hasHydrated, logout, isLoggingOut: logoutMutation.isPending,
    };
}