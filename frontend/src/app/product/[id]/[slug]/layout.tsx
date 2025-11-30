import StorefrontLayout from "@/components/storefront/layout";
import {ReactNode} from "react";

interface ProductLayout {
    children: ReactNode
}

export default function ProductLayout( { children }: ProductLayout) {
    return (
        <StorefrontLayout>
            {children}
        </StorefrontLayout>
    )
}