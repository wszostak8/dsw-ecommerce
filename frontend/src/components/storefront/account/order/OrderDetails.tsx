import React from 'react';
import { Order } from '@/generated/ecommerce/order';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate, mapOrderStatusToUi } from '@/utils/orderUImapper';

interface OrderDetailsProps {
    order: Order;
    onBack: () => void;
}

export const OrderDetails = ({ order, onBack }: OrderDetailsProps) => {
    const { label, variant } = mapOrderStatusToUi(order.status);
    const address = order.address;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-3">
                        Zamówienie #{order.orderId}
                        <Badge variant={variant === 'shipped' ? 'secondary' : variant === 'cancelled' ? 'destructive' : 'default'}>
                            {label}
                        </Badge>
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Złożone dnia {formatDate(order.createdAt)}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Produkty</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        {/* Obrazek produktu */}
                                        <div className="h-14 w-14 rounded-md border bg-muted flex items-center justify-center overflow-hidden">
                                            <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="max-w-[400px]">
                                            <p className="font-medium">{item.productName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.quantity} x {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="font-semibold">
                                        {formatCurrency(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                            <Separator />
                            <div className="flex justify-between font-bold items-center pt-2">
                                <span>Razem</span>
                                <span>{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                Dane kontaktowe
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3 text-muted-foreground">
                            {address && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5" />
                                        <span>{address.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-3.5 w-3.5" />
                                        <span>{address.phoneNumber}</span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

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