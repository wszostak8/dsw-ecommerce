"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabHeader } from '@/components/ui/sidebartab/tabheader';
import { AddressForm } from "@/components/storefront/account/address/AddressForm";

export const AddressTab = () => {
    return (
        <div className="space-y-4">
            <TabHeader
                title="Adres dostawy"
                description="Zaktualizuj swój domyślny adres dostawy"
            />
            <Card>
                <CardHeader>
                    <CardTitle>Dane adresowe</CardTitle>
                    <CardDescription>Wprowadź swój pełny adres do wysyłki</CardDescription>
                </CardHeader>
                <CardContent>
                   <AddressForm />
                </CardContent>
            </Card>
        </div>
    );
};