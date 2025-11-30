"use client"

import { Package, MapPin, Shield } from 'lucide-react';
import { SidebarTabLayout, TabItem } from '@/components/ui/sidebartab/layout';
import { OrdersTab } from '@/components/storefront/account/order/OrderTab';
import { AddressTab } from '@/components/storefront/account/address/AddressTab';
import { SecurityTab } from '@/components/storefront/account/security/SecurityTab';

export const AccountPanel = () => {
    const tabs: TabItem[] = [
        {
            id: 'orders',
            label: 'Moje zamówienia',
            icon: Package,
            content: <OrdersTab />
        },
        {
            id: 'address',
            label: 'Adres dostawy',
            icon: MapPin,
            content: <AddressTab />
        },
        {
            id: 'security',
            label: 'Ustawienia logowania',
            icon: Shield,
            content: <SecurityTab />
        },
    ];

    return <SidebarTabLayout tabs={tabs} title="Moje konto" />;
}