"use client"

import { Button } from '@/components/ui/button'
import { Logo } from "@/components/Logo";
import { RiUserFill } from "@remixicon/react";
import { CartButton } from "@/components/storefront/ui/CartButton";
import { useAuth } from "@/api/stores/auth";
import UserDropdown from "@/components/admin/user-dropdown";
import Link from "next/link";
import { AnimatedThemeSwitch } from "@/components/ui/animatedthemeswitch";

export default function Navbar() {
    const { isAuthed } = useAuth();

    return (
        <header className="px-4 md:px-6">
            <div className="flex h-18 items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <AnimatedThemeSwitch />
                </div>

                <div className="flex items-center gap-3">
                    {isAuthed ? (
                        <Link href="/account">
                            <UserDropdown />
                        </Link>
                    ) : (
                        <Link href="/login">
                            <Button variant="outline" className="flex items-center gap-2">
                                <RiUserFill />
                                <span>Zaloguj się</span>
                            </Button>
                        </Link>
                    )}

                    <CartButton />
                </div>
            </div>
        </header>
    );
}
