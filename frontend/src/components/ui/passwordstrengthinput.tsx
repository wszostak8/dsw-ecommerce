"use client"

import * as React from "react"
import { useId, useMemo, useState, useEffect } from "react"
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react"

import { Input } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cn } from "@/lib/cn"

interface PasswordStrengthInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function PasswordStrengthInput({
                                        value,
                                        onChange,
                                        id: propId,
                                        className,
                                        ...props
                                      }: PasswordStrengthInputProps) {
  const generatedId = useId()
  const id = propId || generatedId

  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const toggleVisibility = () => setIsVisible((prev) => !prev)

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "Co najmniej 8 znaków" },
      { regex: /[0-9]/, text: "Co najmniej 1 cyfra" },
      { regex: /[a-z]/, text: "Co najmniej 1 mała litera" },
      { regex: /[A-Z]/, text: "Co najmniej 1 wielka litera" },
    ]
    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }))
  }

  const strength = useMemo(() => checkStrength(value), [value])
  const strengthScore = useMemo(
    () => strength.filter((req) => req.met).length,
    [strength]
  )

  useEffect(() => {
    if (strengthScore === 4) {
      setIsPopoverOpen(false)
    }
  }, [strengthScore])

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border"
    if (score <= 1) return "bg-red-500"
    if (score <= 2) return "bg-orange-500"
    if (score === 3) return "bg-amber-500"
    return "bg-emerald-500"
  }

  const getStrengthText = (score: number) => {
    if (score === 0) return "Wprowadź hasło"
    if (score <= 2) return "Słabe hasło"
    if (score === 3) return "Średnie hasło"
    return "Silne hasło"
  }

  // @ts-ignore
  return (
    <div className={cn("flex w-full flex-col", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              id={id}
              className="pe-9"
              type={isVisible ? "text" : "password"}
              value={value}
              onChange={(e) => {
                onChange(e)
                if (strengthScore < 4) {
                  setIsPopoverOpen(true)
                }
              }}
              onMouseEnter={() => {
               setIsPopoverOpen(true)
              }}
              onMouseLeave={() => setIsPopoverOpen(false)}
              onFocus={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              {...props}
            />
            <button
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-2xl text-muted-foreground/80 outline-none transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 hover:cursor-pointer"
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsPopoverOpen(false)
                toggleVisibility()
              }}
              onMouseEnter={(e) => e.stopPropagation()}
              onMouseLeave={(e) => e.stopPropagation()}
              aria-label={isVisible ? "Ukryj hasło" : "Pokaż hasło"}
            >
              {isVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          </div>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          align="start"
          className="w-full sm:w-86"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="mb-2 text-sm font-medium text-foreground dark:text-white/90">
            {getStrengthText(strengthScore)}. Musi zawierać:
          </p>
          <ul
            className="space-y-1.5 text-xs"
            aria-label="Wymagania dotyczące hasła"
          >
            {strength.map((req, index) => (
              <li key={index} className="flex items-center gap-2">
                {req.met ? (
                  <CheckIcon size={14} className="text-emerald-500" />
                ) : (
                  <XIcon size={14} className="text-muted-foreground/80" />
                )}
                <span
                  className={cn(
                    req.met ? "text-emerald-600" : "text-muted-foreground"
                  )}
                >
                  {req.text}
                </span>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div
          className="mb-2 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuenow={strengthScore}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-label="Siła hasła"
        >
          <div
            className={`h-full ${getStrengthColor(
              strengthScore
            )} transition-all duration-500 ease-out`}
            style={{ width: `${(strengthScore / 4) * 100}%` }}
          ></div>
        </div>
      )}
    </div>
  )
}