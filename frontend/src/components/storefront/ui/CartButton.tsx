"use client"

import { useCartStore } from "@/api/stores/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiShoppingBasketFill } from "@remixicon/react";
import Link from "next/link";

export const CartButton = () => {
    const { cartCount } = useCartStore();

    return (
        <Link href="/cart">
            <Button
                variant="default"
                size="icon"
                className="relative"
            >
                <RiShoppingBasketFill className="h-5 w-5" />
                {cartCount > 0 && (
                    <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-1 text-xs"
                    >
                        {cartCount}
                    </Badge>
                )}
            </Button>
        </Link>
    );
};