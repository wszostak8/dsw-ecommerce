"use client"

import React, { useRef } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"
import { Switch } from './switch'
import { useTheme } from "@/providers/ThemeProvider"

interface AnimatedThemeSwitchProps
  extends React.ComponentPropsWithoutRef<"div"> {
  duration?: number
}

export const AnimatedThemeSwitch = ({
                                      duration = 600,
                                      className,
                                      ...props
                                    }: AnimatedThemeSwitchProps) => {
  const { theme, toggleTheme } = useTheme()
  const switchRef = useRef<HTMLButtonElement>(null)
  const checked = theme === "dark"

  const handleToggle = async () => {
    if (!switchRef.current) return

    // Jeśli przeglądarka obsługuje View Transitions API
    if ("startViewTransition" in document) {
      await (document as any).startViewTransition(() => {
        flushSync(() => toggleTheme())
      }).ready

      const { top, left, width, height } =
        switchRef.current.getBoundingClientRect()
      const x = left + width / 2
      const y = top + height / 2
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      )

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    } else {
      // fallback bez animacji
      toggleTheme()
    }
  }

  return (
    <div
      className={`flex items-center space-x-3 ${className ?? ""}`}
      {...props}
    >
      <Sun className="size-4 text-foreground dark:text-white/90" />
      <Switch
        ref={switchRef}
        checked={checked}
        onCheckedChange={handleToggle}
        aria-label="Toggle theme"
      />
      <Moon className="size-4 text-foreground dark:text-white/90" />
    </div>
  )
}
