"use client";

import React, { useState } from 'react';
import { TabHeader } from '@/components/ui/sidebartab/tabheader';
import { OrderCard } from './OrderCard';
import { OrderDetails } from './OrderDetails';
import { useMyOrdersQuery } from '@/api/queries/orderQueries';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate, mapOrderStatusToUi } from '@/utils/orderUImapper';
import { Loader2, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Order } from '@/generated/ecommerce/order';

export const OrdersTab = () => {
    const { data, isLoading, isError } = useMyOrdersQuery();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-red-500 py-10">
                Nie udało się załadować historii zamówień.
            </div>
        );
    }

    if (selectedOrder) {
        return (
            <OrderDetails
                order={selectedOrder}
                onBack={() => {
                    setSelectedOrder(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            />
        );
    }

    const rawOrders = data?.orders || [];
    const sortedOrders = [...rawOrders].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <TabHeader
                title="Moje zamówienia"
                description="Zarządzaj swoimi zamówieniami i sprawdzaj ich status"
            />

            {sortedOrders.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/10">
                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PackageOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Brak zamówień</h3>
                    <p className="text-muted-foreground mb-6">
                        Nie złożyłeś jeszcze żadnego zamówienia.
                    </p>
                    <Link href="/">
                        <Button>Przejdź do sklepu</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedOrders.map((order) => {
                        const { variant, label, Icon, actionLabel } = mapOrderStatusToUi(order.status);
                        const itemsCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

                        return (
                            <OrderCard
                                key={order.orderId}
                                orderNumber={`#${order.orderId}`}
                                date={formatDate(order.createdAt)}
                                itemsCount={itemsCount}
                                total={formatCurrency(order.totalAmount)}
                                status={variant}
                                statusLabel={label}
                                actionIcon={Icon}
                                actionLabel={actionLabel}
                                onActionClick={() => {
                                    setSelectedOrder(order);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};