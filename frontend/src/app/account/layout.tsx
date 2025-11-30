import StorefrontLayout from "@/components/storefront/layout";
import {ReactNode} from "react";

interface AccountLayoutProps {
    children: ReactNode
}

export default function AccountLayout( { children }: AccountLayoutProps) {
    return (
        <StorefrontLayout>
            {children}
        </StorefrontLayout>
    )
}