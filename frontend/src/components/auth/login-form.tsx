"use client"

import { cn } from '@/lib/cn';
import { Button } from "../ui/button";
import { Field, FieldDescription, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import React, { useRef, useState, useCallback } from 'react'
import { useLoginMutation } from '@/api/mutations/authMutations';
import { AuthResponseCode } from '@/api/messages/auth/responseCodes';
import { Turnstile, TurnstileRef } from '../CloudflareTurnstile';
import { Spinner } from '../ui/spinner'
import Link from "next/link";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isCooldown, setIsCooldown] = useState(false);

  const turnstileRef = useRef<TurnstileRef>(null);
  const loginMutation = useLoginMutation();

  const handleVerify = useCallback((token: string) => {
    setCaptchaToken(token);
  }, []);

  const handleExpire = useCallback(() => {
    setCaptchaToken(null);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(false);
    setEmailError(false);

    if (!captchaToken) return;

    loginMutation.mutate(
      { email, password, captchaToken },
      {
        onSuccess: (response) => {
          if (!response.success) {
            if (response.errorCode === AuthResponseCode.INVALID_PASSWORD) {
              setPasswordError(true);
            } else if (response.errorCode === AuthResponseCode.INVALID_EMAIL) {
              setEmailError(true);
            }
            turnstileRef.current?.reset();
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 2200);
          }
        },
        onError: () => {
          turnstileRef.current?.reset();
          setIsCooldown(true);
          setTimeout(() => setIsCooldown(false), 2200);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-0", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold dark:text-white/90">Zaloguj się</h1>
        </div>

        <Field>
          <Input
            id="email"
            type="email"
            placeholder="Adres e-mail"
            required
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              if (emailError) setEmailError(false);
            }}
            aria-invalid={emailError ? true : undefined}
          />
        </Field>

        <Field>
          <Input
            id="password"
            placeholder="Hasło"
            type="password"
            required
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              if (passwordError) setPasswordError(false)
            }}
            aria-invalid={passwordError ? true : undefined}
          />
        </Field>

        <Field>
          <Turnstile
            ref={turnstileRef}
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onVerify={handleVerify}
            onExpire={handleExpire}
            action="login"
            theme="auto"
            size="flexible"
          />
        </Field>

        <Field>
          <Button
            variant="default"
            className="text-white/90"
            type="submit"
            disabled={loginMutation.isPending || !captchaToken || isCooldown}
          >
            {!captchaToken || isCooldown
              ? <> <Spinner /> Trwa weryfikacja anti-bot... </>
              : loginMutation.isPending
                ? <> <Spinner /> Logowanie... </>
                : "Zaloguj się"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center flex justify-between">
            Nie masz konta? &nbsp;
            <Link href="/register" className="text-primary">
              Zarejestruj się
            </Link>

            <Link
              href="/reset"
              className="ml-auto text-primary text-sm underline-offset-4 underline"
            >
              Nie pamiętam hasła
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}