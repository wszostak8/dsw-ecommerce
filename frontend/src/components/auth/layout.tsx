import { Ripple } from '@/components/ui/ripple'
import { MoveLeft } from 'lucide-react'
import { AnimatedThemeSwitch } from '@/components/ui/animatedthemeswitch'
import type { ReactNode } from 'react'
import { Logo } from "@/components/Logo";
import Link from "next/link";

interface AuthLayoutProps {
    children: ReactNode
}

export default function AuthLayout( { children }: AuthLayoutProps) {
    return (
        <div className="grid h-screen lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <Logo />
                    </a>
                    <Link href="/" className="justify-center flex items-center gap-2 absolute left-10 bottom-10">
                        <MoveLeft className="text-gray-500 font-light" />
                        <p className="text-gray-500 font-normal text-sm">Wróć do strony głównej</p>
                    </Link>
                    <AnimatedThemeSwitch />
                </div>
                <div className="flex h-full items-center justify-center">
                    <div className="w-full max-w-sm">
                        {children}
                    </div>
                </div>
            </div>
            <div className="bg-gradient-to-br from-[#0e7500] to-green-900 relative hidden lg:block lg:rounded-l-[25rem] xl:rounded-l-[50rem]">
                <div className="flex w-full h-full justify-center items-center">
                    <div className="w-full lg:ml-10 xl:-ml-24">
                    </div>
                    <Ripple className="w-full z-10" />
                </div>
            </div>
        </div>
    )
}