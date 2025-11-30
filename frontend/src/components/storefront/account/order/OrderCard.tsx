import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface OrderCardProps {
    orderNumber: string;
    date: string;
    itemsCount: number;
    total: string;
    status: 'pending' | 'shipped' | 'cancelled';
    statusLabel: string;
    actionIcon: LucideIcon;
    actionLabel: string;
    onActionClick?: () => void;
}

const statusVariant = {
    pending: 'default',
    shipped: 'secondary',
    cancelled: 'destructive',
} as const;

export const OrderCard = ({ orderNumber, date, itemsCount, total, status, statusLabel, actionIcon: ActionIcon, actionLabel, onActionClick }: OrderCardProps) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Zamówienie {orderNumber}</CardTitle>
                        <CardDescription>Złożone {date}</CardDescription>
                    </div>
                    <Badge variant={statusVariant[status]}>{statusLabel}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className="text-sm">
                        {itemsCount} {itemsCount === 1 ? 'produkt' : itemsCount < 5 ? 'produkty' : 'produktów'}
                    </p>
                    <p className="text-lg font-semibold">{total}</p>
                    <Button variant="outline" className="gap-2" onClick={onActionClick}>
                        <ActionIcon className="h-4 w-4" />
                        {actionLabel}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};