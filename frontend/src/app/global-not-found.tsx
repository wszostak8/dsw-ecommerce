import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import NotFound from "@/components/NotFound";
import {ThemeProvider} from "@/providers/ThemeProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Błąd 404 | dsw-ecommerce',
    description: 'Strona której szukasz nie istnieje',
}

export default function GlobalNotFound() {
    return (
        <html lang="pl" className={inter.className}>
            <body>
            <ThemeProvider>
                <NotFound />
            </ThemeProvider>
            </body>
        </html>
    )
}