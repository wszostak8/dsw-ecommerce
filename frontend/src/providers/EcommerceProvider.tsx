"use client";

import { ReactNode } from "react";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { CartProvider } from "@/providers/CartProvider";
import { Toaster } from "sonner";
import {ThemeProvider} from "@/providers/ThemeProvider";

interface EcommerceProvider {
    children: ReactNode
}

export default function ECommerceProvider( { children }: EcommerceProvider) {
    return (
        <TanstackQueryProvider>
            <ThemeProvider>
                <AuthProvider>
                    <CartProvider>
                        <Toaster richColors={true} position="top-center" />
                        {children}
                    </CartProvider>
                </AuthProvider>
            </ThemeProvider>
        </TanstackQueryProvider>
    )
}