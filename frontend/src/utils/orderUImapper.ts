import { OrderStatus } from '@/generated/ecommerce/order';
import { Clock, PackageCheck, Truck, LucideIcon } from 'lucide-react';

type UiStatusVariant = 'pending' | 'shipped' | 'cancelled';

interface UiOrderStatus {
    variant: UiStatusVariant;
    label: string;
    Icon: LucideIcon;
    actionLabel: string;
}

export const mapOrderStatusToUi = (backendStatus: OrderStatus): UiOrderStatus => {
    switch (backendStatus) {
        case OrderStatus.PENDING:
            return {
                variant: 'pending',
                label: 'Przyjęte do realizacji',
                Icon: Clock,
                actionLabel: 'Szczegóły zamówienia'
            };

        case OrderStatus.PAID:
            return {
                variant: 'pending',
                label: 'Opłacone - pakowanie',
                Icon: PackageCheck,
                actionLabel: 'Szczegóły zamówienia'
            };

        case OrderStatus.SHIPPED:
            return {
                variant: 'shipped',
                label: 'Wysłane',
                Icon: Truck,
                actionLabel: 'Śledź przesyłkę'
            };

        default:
            return {
                variant: 'pending',
                label: 'Przetwarzanie',
                Icon: Clock,
                actionLabel: 'Szczegóły zamówienia'
            };
    }
};

export const formatDate = (isoDate: string): string => {
    if (!isoDate) return '';
    try {
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat('pl-PL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    } catch (e) {
        return isoDate;
    }
};