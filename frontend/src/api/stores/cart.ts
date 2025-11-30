"use client"

import { createStore, useStore } from 'zustand';
import { useMemo } from 'react';
import { Cart } from '@/generated/ecommerce/cart';
import { useCartQuery } from '@/api/queries/cartQueries';
import {
    useAddItemMutation,
    useClearCartMutation,
    useRemoveItemMutation,
    useUpdateItemQuantityMutation,
} from '@/api/mutations/cartMutations';

export interface CartState {
    cart: Cart | null;
    isInitialized: boolean;
    setCart: (cart: Cart | null) => void;
    setInitialized: (initialized: boolean) => void;
}

export const cartStore = createStore<CartState>()((set) => ({
    cart: null,
    isInitialized: false,
    setCart: (cart) => set({ cart }),
    setInitialized: (initialized) => set({ isInitialized: initialized }),
}));

export function useCartStore() {
    const { cart, isInitialized } = useStore(cartStore);
    const { isLoading: isCartLoading, isFetching: isCartFetching } = useCartQuery();
    const addItemMutation = useAddItemMutation();
    const updateItemQuantityMutation = useUpdateItemQuantityMutation();
    const removeItemMutation = useRemoveItemMutation();
    const clearCartMutation = useClearCartMutation();

    const items = useMemo(() => cart?.items || [], [cart]);
    const cartCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);
    const totalPrice = useMemo(() => items.reduce((total, item) => total + (item.price * item.quantity), 0), [items]);

    return {
        // Stan
        cart,
        items,
        isInitialized,
        cartCount,
        totalPrice,
        // Statusy
        isLoading: isCartLoading || isCartFetching,
        isUpdating:
            addItemMutation.isPending ||
            updateItemQuantityMutation.isPending ||
            removeItemMutation.isPending ||
            clearCartMutation.isPending,
        // Akcje
        addItem: addItemMutation.mutate,
        updateItemQuantity: updateItemQuantityMutation.mutate,
        removeItem: removeItemMutation.mutate,
        clearCart: clearCartMutation.mutate,
    };
}

export const getCartStore = () => cartStore.getState();