"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/api/stores/cart";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils/formatCurrency";
import { RiCheckFill, RiTruckFill, RiUserFill } from "@remixicon/react";
import { ContactDataForm, ContactDataFormData } from "@/components/storefront/checkout/forms/ContactDataForm";
import { ShippingDataForm, ShippingDataFormData } from "@/components/storefront/checkout/forms/ShippingDataForm";
import { OrderSummary } from "./OrderSummary";
import { useAddressQuery } from "@/api/queries/addressQueries";
import { useAuth } from "@/api/stores/auth";
import { useCreateOrderMutation } from "@/api/mutations/orderMutations";
import { OrderAddress } from "@/generated/ecommerce/order";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Checkout = () => {
    const { items, totalPrice, clearCart } = useCartStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

    const [contactData, setContactData] = useState<ContactDataFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });
    const [shippingData, setShippingData] = useState<ShippingDataFormData>({
        flatNumber: "",
        houseNumber: "",
        street: "",
        zipCode: "",
        city: "",
        country: ""
    });
    const { isAuthed } = useAuth()
    const { data: addressData } = useAddressQuery(isAuthed);

    const router = useRouter();

    useEffect(() => {
        if (addressData?.success && addressData.address) {
            const addr = addressData.address;

            setShippingData((prev) => {
                if (prev.street !== "") return prev;

                return {
                    street: addr.street,
                    houseNumber: addr.houseNumber,
                    flatNumber: addr.flatNumber,
                    zipCode: addr.zipCode,
                    city: addr.city,
                    country: addr.country,
                };
            });

            if (addr.phoneNumber) {
                setContactData((prev) => {
                    if (prev.phone !== "") return prev;
                    return { ...prev, phone: addr.phoneNumber, email: addr.email, firstName: addr.firstName, lastName: addr.lastName };
                });
            }
        }
    }, [addressData]);

    useEffect(() => {
        if (items.length === 0 && currentStep !== 4) {
            router.push("/cart");
        }
    }, [items, router, currentStep]);

    const handleContactNext = (data: ContactDataFormData) => {
        setContactData(data);
        setCurrentStep(2);
    };

    const handleShippingNext = (data: ShippingDataFormData) => {
        setShippingData(data);
        setCurrentStep(3);
    };

    const createOrderMutation = useCreateOrderMutation();
    const isSubmitting = createOrderMutation.isPending;

    const handleSubmit = async () => {
        const orderPayload: OrderAddress = {
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            email: contactData.email,
            phoneNumber: contactData.phone,
            street: shippingData.street,
            houseNumber: shippingData.houseNumber,
            flatNumber: shippingData.flatNumber,
            zipCode: shippingData.zipCode,
            city: shippingData.city,
            country: shippingData.country,
        };

        createOrderMutation.mutate(orderPayload, {
            onSuccess: (response) => {
                if (response.success && response.order) {
                    setCreatedOrderId(response.order.orderId);
                    clearCart();
                    setCurrentStep(4);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    };

    const getStepClass = (step: number) => {
        return step <= currentStep ? "bg-primary" : "bg-foreground";
    };

    if (currentStep === 4) {
        return (
            <div className="container max-w-lg mx-auto mt-20 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <RiCheckFill size={32} />
                </div>
                <h1 className="text-2xl font-bold mb-2">Zamówienie złożone</h1>
                <p className="text-muted-foreground text-sm sm:text-base mb-4">
                    Dziękujemy za zakupy. <br className="sm:hidden"/>Twój numer zamówienia to <span
                    className="text-foreground font-mono font-bold">{createdOrderId}</span>
                    <br className="sm:hidden"/>
                    <br/>Potwierdzenie zostało wysłane na <br className="sm:hidden"/> poniższy adres e-mail: <br/>
                    <strong>{contactData.email}</strong>
                </p>
                <Link href="/">
                    <Button>Wróć do sklepu</Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-xl font-bold mb-8 text-center">Złóż zamówienie</h1>

            <div className={`grid gap-8 items-start ${currentStep === 3 ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
                <div className="lg:col-span-2 space-y-6">
                    {/* PROGRESS BAR */}
                    <div className="flex items-center justify-between w-full max-w-xs relative mb-8 mx-auto">
                        <div className="relative z-10">
                            <div
                                className={`flex items-center ${getStepClass(1)} w-12 h-12 rounded-full justify-center transition-colors duration-300`}
                            >
                                <RiUserFill className="text-white" size={20} />
                            </div>
                        </div>

                        <div className="flex-1 h-1 bg-gray-300 relative overflow-hidden rounded-full">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-in-out"
                                style={{ width: currentStep >= 2 ? "100%" : "0%" }}
                            />
                        </div>

                        <div className="relative z-10">
                            <div
                                className={`flex items-center ${getStepClass(2)} w-12 h-12 rounded-full justify-center transition-colors duration-300`}
                            >
                                <RiTruckFill className={`${currentStep >= 2 ? "text-white" : "text-white dark:text-black"} ${currentStep}`} size={20} />
                            </div>
                        </div>

                        <div className="flex-1 h-1 bg-gray-300 relative overflow-hidden rounded-full">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-in-out"
                                style={{ width: currentStep >= 3 ? "100%" : "0%" }}
                            />
                        </div>

                        <div className="relative z-10">
                            <div
                                className={`flex items-center ${getStepClass(3)} w-12 h-12 rounded-full justify-center transition-colors duration-300`}
                            >
                                <RiCheckFill className={`${currentStep === 3 ? "text-white" : "text-white dark:text-black"}`} size={20} />
                            </div>
                        </div>
                    </div>

                    {/* FORMULARZE */}
                    {currentStep === 1 && (
                        <ContactDataForm onNext={handleContactNext} initialData={contactData} />
                    )}

                    {currentStep === 2 && (
                        <ShippingDataForm
                            onNext={handleShippingNext}
                            onBack={() => setCurrentStep(1)}
                            initialData={shippingData}
                        />
                    )}

                    {currentStep === 3 && (
                        <OrderSummary
                            items={items}
                            totalPrice={totalPrice}
                            onBack={() => setCurrentStep(2)}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </div>

                {currentStep == 3 ?
                    ""
                    :
                    <div className="sticky top-24">
                        <div className="bg-card border p-6 rounded-lg h-fit">
                            <h2 className="text-xl font-bold mb-4">Podsumowanie</h2>
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.productId}
                                         className="flex flex-col xl:flex-row justify-between text-sm items-center gap-2">
                                        <div className="flex items-center gap-2.5 w-full">
                                            {/* Poprawka: dodany check na imageUrl */}
                                            {item.imageUrl && (
                                                <img src={item.imageUrl} alt={item.productName} width={50} height={50}
                                                     className="rounded-md border-1"/>
                                            )}
                                            <span>{item.productName} <strong>x {item.quantity} szt.</strong></span>
                                        </div>
                                        <span
                                            className="text-right max-xl:w-full">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                                <Separator/>
                                <div className="flex justify-between font-bold">
                                    <span>Łącznie</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};