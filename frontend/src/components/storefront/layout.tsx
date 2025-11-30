import {ReactNode} from "react";
import Navbar from "@/components/storefront/Navbar";
import {MarginLayout} from "@/components/ui/marginLayout";
import Footer from "@/components/storefront/Footer";
import {GithubBadge} from "@/components/GithubBadge";

interface StorefrontLayoutProps {
    children: ReactNode
}

export default function StorefrontLayout( { children }: StorefrontLayoutProps) {
    return (
        <>
            <GithubBadge />
            <MarginLayout>
                <Navbar/>
                <div className="mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    {children}
                </div>
            </MarginLayout>
            <Footer />
        </>
    )
}