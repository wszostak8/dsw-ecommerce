import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatCurrency";
import { CartItem } from "@/generated/ecommerce/cart";

interface OrderSummaryProps {
    items: Array<CartItem>;
    totalPrice: number;
    onBack: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export const OrderSummary = ({ items, totalPrice, onBack, onSubmit, isSubmitting }: OrderSummaryProps) => {
    return (
        <div className="bg-card border p-6 rounded-lg max-w-[900px] mx-auto">
            <h2 className="text-xl font-bold mb-4">Podsumowanie</h2>
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm items-center gap-2">
                        <div className="flex items-center gap-2.5">
                            <img src={item.imageUrl} alt={item.productName} width={50} height={50} className="rounded-md" />
                            <span>{item.productName} <strong>x {item.quantity} szt.</strong></span>
                        </div>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                ))}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                    <span>Łącznie</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </div>
            </div>

            <div className="flex justify-between mt-6 gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="w-full"
                >
                    Wstecz
                </Button>
                <Button
                    type="button"
                    className="w-full"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Przetwarzanie..." : "Złóż zamówienie"}
                </Button>
            </div>
        </div>
    );
};