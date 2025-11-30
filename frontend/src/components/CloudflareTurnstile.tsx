"use client"

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useTurnstileStore } from '@/api/stores/cloudflareTurnstileStore'

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: any) => string | undefined;
      reset: (widgetIdOrContainer: string | HTMLElement) => void;
      remove: (widgetIdOrContainer: string | HTMLElement) => void;
    };
  }
}

export interface TurnstileProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
  sitekey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: Error) => void;
  action?: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'flexible';
}

export interface TurnstileRef {
  reset: () => void;
}

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  ({ sitekey, onVerify, onExpire, onError, action, theme = 'dark', size = 'normal', ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const { scriptStatus, setScriptStatus } = useTurnstileStore();

    useEffect(() => {
      if (scriptStatus === 'loaded' || scriptStatus === 'loading') return;

      setScriptStatus('loading');
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.id = 'turnstile-script';
      script.onload = () => setScriptStatus('loaded');
      script.onerror = () => {
        setScriptStatus('error');
        onError?.(new Error('Failed to load Turnstile script.'));
      }
      document.body.appendChild(script);
    }, [scriptStatus, setScriptStatus, onError]);

    useEffect(() => {
      if (scriptStatus !== 'loaded' || !containerRef.current) return;

      if (containerRef.current.children.length > 0) return;

      const widgetId = window.turnstile.render(containerRef.current, {
        sitekey,
        action,
        theme,
        size,
        callback: onVerify,
        'expired-callback': onExpire,
        'error-callback': onError,
      });
      widgetIdRef.current = widgetId || null;

      return () => {
        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch (e) {
            console.error("Błąd podczas usuwania widgetu Turnstile", e);
          }
        }
      };
    }, [scriptStatus, sitekey, action, theme, size, onVerify, onExpire, onError]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (containerRef.current) {
          window.turnstile.reset(containerRef.current);
        }
      },
    }));

    return <div ref={containerRef} {...props} />;
  }
);

Turnstile.displayName = 'Turnstile';