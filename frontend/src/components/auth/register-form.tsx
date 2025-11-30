"use client"

import { cn } from "@/lib/cn";
import { Button } from "../ui/button";
import { Field, FieldDescription, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import React, { useRef, useState, useCallback } from "react";
import { useRegisterMutation } from "@/api/mutations/authMutations";
import { AuthResponseCode } from '@/api/messages/auth/responseCodes';
import { Turnstile, TurnstileRef } from '../CloudflareTurnstile';
import { PasswordStrengthInput } from '../ui/passwordstrengthinput';
import { Spinner } from '../ui/spinner'
import Link from "next/link";

export function RegisterForm({ className, ...props }: React.ComponentProps<"form">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isCooldown, setIsCooldown] = useState(false);

  const turnstileRef = useRef<TurnstileRef>(null);
  const registerMutation = useRegisterMutation();

  const handleVerify = useCallback((token: string) => {
    setCaptchaToken(token);
  }, []);

  const handleExpire = useCallback(() => {
    setCaptchaToken(null);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNameError(false);
    setEmailError(false);
    setPasswordError(false);

    if (!captchaToken) return;

    registerMutation.mutate(
      { name, email, password, captchaToken },
      {
        onSuccess: (response) => {
          if (!response.success) {
            if (response.errorCode === AuthResponseCode.EMAIL_EXISTS) setEmailError(true);
            if (response.errorCode === AuthResponseCode.INVALID_PASSWORD) setPasswordError(true);
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
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold dark:text-white/90">Zarejestruj się</h1>
        </div>

        <Field>
          <Input
            id="name"
            type="text"
            placeholder="Nazwa użytkownika"
            required
            value={name}
            onChange={e => {
              setName(e.target.value);
              if (nameError) setNameError(false);
            }}
            aria-invalid={nameError ? true : undefined}
          />
        </Field>

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
          <PasswordStrengthInput
            id="password"
            placeholder="Hasło"
            required
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(false);
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
            action="register"
            theme="auto"
            size='flexible'
          />
        </Field>

        <Field className="-mt-2">
          <Button
            variant="default"
            className="text-white/90"
            type="submit"
            disabled={registerMutation.isPending || !captchaToken || isCooldown}
          >
            {!captchaToken || isCooldown
              ? <> <Spinner /> Trwa weryfikacja anti-bot... </>
              : registerMutation.isPending
                ? <> <Spinner /> Rejestracja... </>
                : "Zarejestruj się"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Masz już konto?{" "}
            <Link href="/login" className="text-primary">
              Zaloguj się
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}