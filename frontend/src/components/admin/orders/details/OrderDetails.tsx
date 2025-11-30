"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetOrderQuery } from '@/api/queries/orderQueries';
import { useUpdateOrderStatusMutation } from '@/api/mutations/orderMutations';
import { OrderStatus } from '@/generated/ecommerce/order';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate, mapOrderStatusToUi } from '@/utils/orderUImapper';
import {
    ArrowLeft,
    Mail,
    MapPin,
    Phone,
    Package,
    CreditCard,
    Calendar
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface OrderDetailsProps {
    orderId: string;
}

export const OrderDetails = ({ orderId }: OrderDetailsProps) => {
    const router = useRouter();
    const { data, isLoading, isError } = useGetOrderQuery(orderId);
    const updateStatusMutation = useUpdateOrderStatusMutation();

    if (isLoading) return <div className="flex justify-center h-96 items-center"><Spinner /></div>;
    if (isError || !data?.success || !data.order) return <div className="text-center text-destructive p-10">Nie znaleziono zamówienia</div>;

    const order = data.order;
    const address = order.address;
    const { label, variant } = mapOrderStatusToUi(order.status);

    const handleStatusChange = (newStatusStr: string) => {
        const newStatus = Number(newStatusStr) as OrderStatus;
        updateStatusMutation.mutate({ orderId: order.orderId, status: newStatus });
    };

    const statuses = [
        { value: OrderStatus.PENDING, label: 'Przyjęte do realizacji' },
        { value: OrderStatus.PAID, label: 'Opłacone - pakowanie' },
        { value: OrderStatus.SHIPPED, label: 'Wysłane' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            Zamówienie #{order.orderId}
                            <Badge variant={variant === 'shipped' ? 'secondary' : variant === 'cancelled' ? 'destructive' : 'default'}>
                                {label}
                            </Badge>
                        </h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            Złożone dnia {formatDate(order.createdAt)}
                        </p>
                    </div>
                </div>

                {/* ZMIANA STATUSU */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium hidden sm:inline">Status:</span>
                    <Select
                        defaultValue={order.status.toString()}
                        onValueChange={handleStatusChange}
                        disabled={updateStatusMutation.isPending}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Zmień status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statuses.map((s) => (
                                <SelectItem key={s.value} value={s.value.toString()}>
                                    {s.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* LEWA KOLUMNA: PRODUKTY */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Produkty</CardTitle>
                            <CardDescription>Lista pozycji w zamówieniu</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="h-14 w-14 rounded-md border bg-muted flex items-center justify-center overflow-hidden">
                                                <img src={item.imageUrl} alt={item.productName}
                                                     className="h-full w-full object-cover"/>
                                            </div>
                                            <div className="max-w-[400px]">
                                                <p className="font-medium">{item.productName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    ID: {item.productId}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                            <p className="text-sm text-muted-foreground">{item.quantity} szt.
                                                x {formatCurrency(item.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-6"/>
                            <div className="flex justify-between font-bold items-center pt-2">
                                <span>Razem</span>
                                <span>{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* PRAWA KOLUMNA: INFO O KLIENCIE I ADRESIE */}
                <div className="space-y-6">
                    {/* KLIENT */}
                    <Card>
                    <CardHeader>
                            <CardTitle className="text-base">Dane klienta</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {address?.firstName?.[0]}{address?.lastName?.[0]}
                                </div>
                                <div>
                                    <p className="font-medium">{address?.firstName} {address?.lastName}</p>
                                    {order.userId ? (
                                        <p className="text-xs text-muted-foreground">Użytkownik zarejestrowany</p>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">Zamówienie gościa</p>
                                    )}
                                </div>
                            </div>
                            <Separator />
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <a href={`mailto:${address?.email}`} className="hover:text-primary transition-colors">
                                        {address?.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span>{address?.phoneNumber}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ADRES */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Adres dostawy</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-1">
                            <div className="flex gap-2">
                                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                <div>
                                    <p>{address?.firstName} {address?.lastName}</p>
                                    <p>{address?.street} {address?.houseNumber} {address?.flatNumber ? `/ ${address.flatNumber}` : ''}</p>
                                    <p>{address?.zipCode} {address?.city}</p>
                                    <p>{address?.country}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};