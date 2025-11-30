"use client"

import { useCartStore } from "@/api/stores/cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";

export const Cart = () => {
    const { items, totalPrice, updateItemQuantity, removeItem, clearCart, isUpdating } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 mt-20 py-12 text-center">
                <h1 className="text-2xl font-bold mb-2">Twój koszyk jest pusty</h1>
                <p className="text-muted-foreground mb-4">Dodaj produkty do koszyka, aby zobaczyć je tutaj.</p>
                <Button asChild>
                    <Link href="/">Wróć do sklepu</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="pb-32 lg:pb-0">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl font-bold">Twój koszyk</h1>

                <Button
                    variant="destructive"
                    className="gap-2 h-10 hidden lg:flex"
                    onClick={() => clearCart()}
                    disabled={isUpdating}
                >
                    <Trash2 className="h-4 w-4" />
                    Wyczyść koszyk
                </Button>

                <Button
                    variant="destructive"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => clearCart()}
                    disabled={isUpdating}
                >
                    <Trash2 className="h-5 w-5" />
                </Button>
            </div>

            {/* GRID tylko na desktopie */}
            <div className="lg:grid lg:grid-cols-3 gap-8 items-start">
                {/* LISTA PRODUKTÓW */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.productId}
                            className="
                                flex flex-col
                                lg:flex-row lg:items-center lg:justify-between
                                border p-4 rounded-lg bg-card gap-4
                            "
                        >
                            {/* Produkt */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.imageUrl}
                                    alt={item.productName}
                                    className="rounded-md object-cover border-1 w-[60px] h-[60px] md:w-[80px] md:h-[80px]"
                                />
                                <div>
                                    <h2 className="font-semibold text-base">{item.productName}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {formatCurrency(item.price)}
                                    </p>
                                </div>
                            </div>

                            {/* Kontrolki mobilne (pod produktem) */}
                            <div className="flex flex-col-reverse lg:hidden gap-3">
                                {/* Ilość + kosz */}
                                <div className="flex items-center justify-between">
                                    {/* Ilość */}
                                    <div className="flex items-center border rounded-md">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateItemQuantity({
                                                productId: item.productId,
                                                newQuantity: item.quantity - 1,
                                            })}
                                            disabled={isUpdating}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>

                                        <span className="w-8 text-center">{item.quantity}</span>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateItemQuantity({
                                                productId: item.productId,
                                                newQuantity: item.quantity + 1,
                                            })}
                                            disabled={isUpdating}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Usunięcie */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive"
                                        onClick={() => removeItem({ productId: item.productId })}
                                        disabled={isUpdating}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>

                                {/* Cena */}
                                <p className="font-semibold text-right">
                                    {formatCurrency(item.price * item.quantity)}
                                </p>
                            </div>

                            {/* DESKTOP kontrolki */}
                            <div className="hidden lg:flex items-center gap-4">
                                <div className="flex items-center border rounded-md">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => updateItemQuantity({
                                            productId: item.productId,
                                            newQuantity: item.quantity - 1,
                                        })}
                                        disabled={isUpdating}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>

                                    <span className="w-8 text-center">{item.quantity}</span>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => updateItemQuantity({
                                            productId: item.productId,
                                            newQuantity: item.quantity + 1,
                                        })}
                                        disabled={isUpdating}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                <p className="font-semibold w-24 text-right">
                                    {formatCurrency(item.price * item.quantity)}
                                </p>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                    onClick={() => removeItem({ productId: item.productId })}
                                    disabled={isUpdating}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* PODSUMOWANIE – DESKTOP */}
                <div className="bg-card border p-6 rounded-lg h-fit sticky top-24 hidden lg:block">
                    <h2 className="text-xl font-bold mb-4">Podsumowanie</h2>

                    <div className="space-y-2 text-muted-foreground">
                        <div className="flex justify-between text-sm">
                            <span>Suma częściowa</span>
                            <span>{formatCurrency(totalPrice)}</span>
                        </div>
                    </div>

                    <div className="border-t my-4"></div>

                    <div className="flex justify-between font-bold">
                        <span>Łącznie</span>
                        <span>{formatCurrency(totalPrice)}</span>
                    </div>

                    <Button asChild className="w-full mt-6">
                        <Link href="/checkout">Przejdź do kasy</Link>
                    </Button>
                </div>
            </div>

            {/* PODSUMOWANIE – MOBILE sticky bottom */}
            <div className="lg:hidden fixed  left-0 right-0 bg-card border-t p-4">
                <div className="flex justify-between font-bold mb-4">
                    <span>Łącznie</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </div>
                <Button asChild className="w-full">
                    <Link href="/checkout">Przejdź do kasy</Link>
                </Button>
            </div>
        </div>
    );
};
