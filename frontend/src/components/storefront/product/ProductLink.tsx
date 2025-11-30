import Link from "next/link";
import { ReactNode } from "react";
import { slugify } from "@/utils/slugify";

export interface ProductLinkProps {
    product: {
        id: number;
        productName: string;
    };
    children?: ReactNode;
    className?: string;
}

export function ProductLink({ product, children, className }: ProductLinkProps) {
    const slug = slugify(product.productName);

    return (
        <Link
            href={`/product/${product.id}/${slug}`}
            className={className}
        >
            {children ?? product.productName}
        </Link>
    );
}