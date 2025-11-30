"use client"

import { cn } from '@/lib/cn';
import { Button } from "../ui/button";
import { Field, FieldDescription, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import React, { useState, useRef, useCallback } from 'react';
import {
  useRequestPasswordResetMutation,
  useVerifyPasswordResetCodeMutation,
  usePerformPasswordResetMutation
} from '@/api/mutations/authMutations';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';
import { authMessages } from '@/api/messages/auth/message';
import { AuthResponseCode } from '@/api/messages/auth/responseCodes';
import { VerificationCodeDialog, VerificationCodeDialogRef } from '@/components/ui/verificationcodedialog';
import Link from "next/link";

type Step = 'enter_email' | 'enter_password';

export function PasswordResetForm({ className, ...props }: React.ComponentProps<"div">) {
  const [step, setStep] = useState<Step>('enter_email');
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const dialogRef = useRef<VerificationCodeDialogRef>(null);

  const requestMutation = useRequestPasswordResetMutation();
  const verifyMutation = useVerifyPasswordResetCodeMutation();
  const performMutation = usePerformPasswordResetMutation();

  const handleRequestReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError(false);
    requestMutation.mutate({ email }, {
      onSuccess: (res) => {
        if (res.success) {
          toast.success(authMessages[res.errorCode as AuthResponseCode] || "Kod został wysłany.");
          setIsCodeDialogOpen(true);
        } else {
          toast.error(authMessages[res.errorCode as AuthResponseCode] || "Użytkownik o takim adresie e-mail nie istnieje.");
          setEmailError(true);
        }
      },
    });
  };

  const handleVerifyCode = useCallback((code: string) => {
    verifyMutation.mutate({ email, token: code }, {
      onSuccess: (res) => {
        if (res.success && res.token) {
          toast.success(authMessages[res.errorCode as AuthResponseCode] || "Kod został zweryfikowany pomyślnie.");
          setVerificationToken(res.token);
          setIsCodeDialogOpen(false);
          setStep('enter_password');
        } else {
          toast.error(authMessages[res.errorCode as AuthResponseCode] || "Niepoprawny lub wygasły kod weryfikacji.");
          dialogRef.current?.reset();
        }
      },
      onError: () => {
        dialogRef.current?.reset();
      }
    });
  }, [verifyMutation, email, dialogRef]);

  const handlePerformReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(false);
    if (newPassword !== confirmPassword) {
      toast.error("Hasła nie są takie same.");
      setPasswordError(true);
      return;
    }
    if (!verificationToken) {
      toast.error("Sesja weryfikacji wygasła. Prosimy zacząć od nowa.");
      setStep('enter_email');
      return;
    }
    performMutation.mutate({ token: verificationToken, newPassword });
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <form onSubmit={step === 'enter_email' ? handleRequestReset : handlePerformReset} className="flex flex-col gap-0">
        <FieldGroup>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold dark:text-white/90">
              {step === 'enter_email' ? 'Resetowanie hasła' : 'Ustaw nowe hasło'}
            </h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {step === 'enter_email'
                ? 'Wprowadź swój adres e-mail aby otrzymać 6 cyfrowy kod'
                : 'Wprowadź i potwierdź swoje nowe hasło.'}
            </p>
          </div>

          {step === 'enter_email' ? (
            <Field>
              <Input id="email" type="email" placeholder="Adres e-mail" required value={email} onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(false); }} aria-invalid={emailError} />
            </Field>
          ) : (
            <>
              <Field>
                <Input id="newPassword" placeholder="Nowe hasło" type="password" required value={newPassword} onChange={(e) => { setNewPassword(e.target.value); if (passwordError) setPasswordError(false); }} aria-invalid={passwordError} />
              </Field>
              <Field>
                <Input id="confirmPassword" placeholder="Potwierdź nowe hasło" type="password" required value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); if (passwordError) setPasswordError(false); }} aria-invalid={passwordError} />
              </Field>
            </>
          )}

          <Field className="-mt-2">
            <Button variant="default" className="text-white/90" type="submit" disabled={requestMutation.isPending || performMutation.isPending}>
              {step === 'enter_email'
                ? (requestMutation.isPending ? <> <Spinner /> Wysyłanie... </> : "Wyślij kod")
                : (performMutation.isPending ? <> <Spinner /> Zapisywanie... </> : "Zresetuj hasło")}
            </Button>
            {step === 'enter_email' && (
              <FieldDescription className="text-center">
                Pamiętasz swoje hasło? &nbsp; <Link href="/login" className="text-primary">Wróć do logowania</Link>
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
      </form>

      <VerificationCodeDialog
        title="Resetowanie hasła"
        ref={dialogRef}
        isOpen={isCodeDialogOpen}
        onOpenChange={setIsCodeDialogOpen}
        onVerify={handleVerifyCode}
        isVerifying={verifyMutation.isPending}
        hasError={verifyMutation.isError} // `isError` jest teraz używane tylko do wyświetlania, nie logiki
        email={email}
      />
    </div>
  );
}