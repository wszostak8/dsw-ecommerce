"use client"

import { Product } from "@/generated/ecommerce/product";
import { ImageIcon } from "lucide-react";
import {RiShoppingBasketFill} from "@remixicon/react";
import {useCartStore} from "@/api/stores/cart";
import {formatCurrency} from "@/utils/formatCurrency";
import {ProductLink} from "@/components/storefront/product/ProductLink";
import React from "react";

interface ProductListCardProps {
    product: Product;
}

export const ProductListCard = ({ product }: ProductListCardProps) => {
    const { addItem } = useCartStore();

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()

        addItem({ productId: product.id, quantity: 1 });
    }

    const mainImage = product.images?.[0];

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 transition-shadow duration-300 ease-in-out hover:shadow-xl">
            <div className="relative aspect-w-3 aspect-h-4 bg-gray-200 dark:bg-neutral-700 sm:aspect-none sm:h-60">
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={product.productName}
                        className="h-full w-full object-cover object-center"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        <ImageIcon className="h-12 w-12 text-muted-foreground"/>
                    </div>
                )}

                <button
                    onClick={handleAddToCart}
                    className="absolute hover:cursor-pointer bottom-3 right-3 z-10 rounded-full bg-secondary text-primary-foreground dark:text-white/90
                               transition-all duration-300 ease-in-out
                               hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                               w-10 h-10
                               group-hover:w-40
                               flex items-center justify-center
                               group-hover:justify-start group-hover:px-3"
                >
                    <RiShoppingBasketFill className="h-5 w-5 flex-shrink-0"/>

                    <span className="overflow-hidden text-sm font-medium whitespace-nowrap transition-all duration-200 w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 group-hover:ml-2">
                        Dodaj do koszyka
                    </span>
                </button>
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    <ProductLink product={product}>
                        <span aria-hidden="true" className="absolute inset-0 z-0"/>
                        {product.productName}
                    </ProductLink>
                </h3>
                <div className="flex flex-1 flex-col justify-end">
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{formatCurrency(product.price)}</p>
                </div>
            </div>
        </div>
    );
};