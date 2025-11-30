"use client";

import React, { useEffect } from 'react';
import { useStore } from 'zustand';
import { toast } from 'sonner';
import { cartStore } from '@/api/stores/cart';
import { useCartQuery } from '@/api/queries/cartQueries';
import { setCookie, getCookie } from '@/utils/cookie';
import { globalMessage } from '@/api/messages/global/message';

const GUEST_CART_COOKIE = 'guest-cart-id';

export function CartProvider({ children }: { children: React.ReactNode }) {
    const isInitialized = useStore(cartStore, (state) => state.isInitialized);
    const { setInitialized, setCart } = cartStore.getState();

    const { data, isSuccess, isError, error } = useCartQuery();

    useEffect(() => {
        if (!getCookie(GUEST_CART_COOKIE)) {
            setCookie(GUEST_CART_COOKIE, crypto.randomUUID(), 30);
        }
    }, []);

    useEffect(() => {
        if (isInitialized) {
            return;
        }

        if (isSuccess) {
            if (data.success && data.cart) {
                setCart(data.cart);
            } else {
                setCart(null);
            }
            setInitialized(true);
        } else if (isError) {
            setCart(null);
            setInitialized(true);
            toast.error(error?.message === 'Failed to fetch' ? globalMessage.failedToFetch : error?.message);
        }
    }, [isSuccess, isError, data, error, isInitialized, setCart, setInitialized]);

    if (!isInitialized) {
        return null;
    }

    return <>{children}</>;
}