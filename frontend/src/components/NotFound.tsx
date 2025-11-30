"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AnimatedThemeSwitch } from '@/components/ui/animatedthemeswitch'
import { Logo } from "@/components/Logo";
import Link from "next/link";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute left-10 top-10 flex gap-2">
        <Logo />
        <AnimatedThemeSwitch />
      </div>
      <div className="max-w-md w-full space-y-6">
        {/* 404 Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.657 2.172M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
              />
            </svg>
          </div>
        </div>

        {/* 404 Content */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="outline" className="text-lg px-3 py-1 font-mono">
                404
              </Badge>
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Strona nie została znaleziona</h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Przepraszamy, ale strona którą próbujesz odwiedzić <br /> nie istnieje lub została przeniesiona.
            </p>
          </div>

          {/* Help Section */}
          <details className="group">
            <summary className="cursor-pointer list-none">
              <Badge variant="outline" className="hover:bg-accent border-border/50">
                <svg
                  className="w-4 h-4 mr-1 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Co mogę zrobić?
              </Badge>
            </summary>
            <div className="mt-3 p-4 bg-muted/50 rounded-lg border border-border/50 text-left">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>Sprawdź czy adres URL jest poprawny</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>Użyj przycisku "Wróć" aby powrócić do poprzedniej strony</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>Przejdź do strony głównej i spróbuj nawigować ponownie</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>Skontaktuj się z nami jeśli problem się powtarza</span>
                </div>
              </div>
            </div>
          </details>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/">
              <Button className="flex-1 w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Strona główna
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex-1 w-full"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Wróć
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
