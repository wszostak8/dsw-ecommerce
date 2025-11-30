"use client"

import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import { OTPInput, SlotProps } from "input-otp";
import { cn } from "@/lib/cn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Mail } from 'lucide-react'

export interface VerificationCodeDialogRef {
  reset: () => void;
}

interface VerificationCodeDialogProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onVerify: (code: string) => void;
  isVerifying: boolean;
  hasError: boolean;
  email: string;
}

export const VerificationCodeDialog = forwardRef<VerificationCodeDialogRef, VerificationCodeDialogProps>(
  ({ title, isOpen, onOpenChange, onVerify, isVerifying, hasError, email }, ref) => {
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!isOpen) {
        setValue("");
      }
    }, [isOpen]);

    useImperativeHandle(ref, () => ({
      reset() {
        setValue("");
        inputRef.current?.focus();
      }
    }));

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-[440px]">
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <Mail className="text-primary" />
            </div>
            <DialogHeader>
              <DialogTitle className="sm:text-center">{title}</DialogTitle>
              <DialogDescription className="sm:text-center">
                Wprowadź 6 cyfrowy kod wysłany na adres <br /> <strong>{email}</strong>
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              <OTPInput
                ref={inputRef}
                value={value}
                onChange={setValue}
                maxLength={6}
                containerClassName="group flex items-center has-[:disabled]:opacity-30"
                render={({ slots }) => (
                  <div className="flex gap-2">
                    {slots.map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                )}
                disabled={isVerifying}
                onComplete={onVerify}
              />
            </div>

            {isVerifying && (
              <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Spinner /> Weryfikacja...
              </p>
            )}

            {hasError && !isVerifying && (
              <p className="text-center text-xs text-destructive" role="alert" aria-live="polite">
                Niepoprawny lub wygasły kod. Spróbuj ponownie.
              </p>
            )}

            {/*<p className="text-center text-sm">*/}
            {/*  <button className="underline hover:no-underline bg-transparent border-none cursor-pointer text-muted-foreground">*/}
            {/*    Wyślij kod ponownie*/}
            {/*  </button>*/}
            {/*</p>*/}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "flex size-9 items-center justify-center rounded-md border border-input bg-background font-medium text-foreground shadow-xs transition-[color,box-shadow]",
        { "z-10 border-ring ring-[3px] ring-ring/50": props.isActive }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}