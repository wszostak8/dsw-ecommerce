"use client";

import React, { useEffect, useRef } from 'react';
import { authStore, useAuthStore } from '@/api/stores/auth';
import { useRefreshTokenMutation } from '@/api/mutations/authMutations';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isInitialized, setInitialized, hasHydrated } = useAuthStore();
  const refreshMutation = useRefreshTokenMutation();
  const didAttemptRefresh = useRef(false);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (didAttemptRefresh.current) {
      return;
    }

    if (!user) {
      if (!isInitialized) setInitialized(true);
      didAttemptRefresh.current = true;
      return;
    }

    didAttemptRefresh.current = true;

    refreshMutation.mutate(undefined, {
      onSettled: () => {
        setInitialized(true);
      },
    });
  }, [hasHydrated, isInitialized, setInitialized, refreshMutation, user]);

  if (!isInitialized || !hasHydrated) {
    return null;
  }

  return <>{children}</>;
}