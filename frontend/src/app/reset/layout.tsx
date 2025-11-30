import StorefrontLayout from "@/components/storefront/layout";
import {ReactNode} from "react";

interface ResetLayout {
    children: ReactNode
}

export default function ResetLayout( { children }: ResetLayout) {
    return (
        <StorefrontLayout>
            {children}
        </StorefrontLayout>
    )
}