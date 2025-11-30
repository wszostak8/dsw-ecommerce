import StorefrontLayout from "@/components/storefront/layout";
import {ReactNode} from "react";

interface LoginLayout {
    children: ReactNode
}

export default function LoginLayout( { children }: LoginLayout) {
    return (
        <StorefrontLayout>
            {children}
        </StorefrontLayout>
    )
}