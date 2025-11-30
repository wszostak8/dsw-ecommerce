import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "@/styles/globals.css";
import React from "react";
import ECommerceProvider from "@/providers/EcommerceProvider";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dsw-ecommerce",
  description: "System e-commerce",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} antialiased`}>
        <ECommerceProvider>
          {children}
        </ECommerceProvider>
      </body>
    </html>
  );
}
