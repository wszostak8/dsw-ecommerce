import StorefrontLayout from "@/components/storefront/layout";
import {ReactNode} from "react";

interface RegisterLayout {
    children: ReactNode
}

export default function RegisterLayout( { children }: RegisterLayout) {
    return (
        <StorefrontLayout>
            {children}
        </StorefrontLayout>
    )
}