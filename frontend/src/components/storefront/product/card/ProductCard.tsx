"use client"

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import { ProductGallery } from "./ProductGallery";
import { RiShoppingBasketFill } from "@remixicon/react";
import { useCartStore } from "@/api/stores/cart";
import React from "react";
import { Product } from "@/generated/ecommerce/product";

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCartStore();

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()

        addItem({ productId: product.id, quantity: 1 });
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,500px)_1fr] md:gap-14">
                <ProductGallery images={product.images} />

                <div className="flex flex-col gap-4 w-full p-2">
                    <div className="flex flex-col justify-center w-full gap-4 md:min-h-[500px]">
                        <h1 className="text-2xl font-bold text-center">{product.productName}</h1>
                        <p className="text-xl font-semibold text-center">{formatCurrency(product.price)}</p>
                        <Button onClick={handleAddToCart} className="w-2/3 mx-auto">
                            <RiShoppingBasketFill className="h-5 w-5 flex-shrink-0"/>
                            Dodaj do koszyka
                        </Button>
                    </div>
                    <div />
                </div>
            </div>

            <div className="mt-6 p-2">
                <h2 className="text-lg font-semibold mb-2">Opis produktu</h2>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {product.description}
                </p>
            </div>
        </div>
    );
}