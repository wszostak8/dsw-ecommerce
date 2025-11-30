import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../apiClient';
import { getCartStore } from '@/api/stores/cart';
import {
    AddItemRequest,
    CartResponse,
    UpdateItemQuantityRequest,
} from '@/generated/ecommerce/cart';

export function useAddItemMutation() {
    const { setCart } = getCartStore();
    return useMutation({
        mutationKey: ['cart', 'addItem'],
        mutationFn: async ({ productId, quantity }: { productId: number, quantity: number }): Promise<CartResponse> => {
            const requestMessage = AddItemRequest.create({ productId, quantity });
            const binaryBody = AddItemRequest.encode(requestMessage).finish();
            const safeBinaryBody = new Uint8Array(binaryBody);

            const responseBuffer = await api.post('cart/items', {
                body: new Blob([safeBinaryBody]),
                headers: { 'Content-Type': 'application/x-protobuf' },
            }).arrayBuffer();

            return CartResponse.decode(new Uint8Array(responseBuffer));
        },
        onSuccess: (response) => {
            if (response.success && response.cart) {
                toast.success("Produkt dodany do koszyka");
                setCart(response.cart);
            } else {
                toast.error(response.errorCode || "Nie udało się dodać produktu.");
            }
        },
        onError: (error: Error) => toast.error(error.message),
    });
}

export function useUpdateItemQuantityMutation() {
    const { setCart } = getCartStore();
    return useMutation({
        mutationKey: ['cart', 'updateQuantity'],
        mutationFn: async ({ productId, newQuantity }: { productId: number, newQuantity: number }): Promise<CartResponse> => {
            const requestMessage = UpdateItemQuantityRequest.create({ newQuantity });
            const binaryBody = UpdateItemQuantityRequest.encode(requestMessage).finish();
            const safeBinaryBody = new Uint8Array(binaryBody);

            const responseBuffer = await api.put(`cart/items/${productId}`, {
                body: new Blob([safeBinaryBody]),
                headers: { 'Content-Type': 'application/x-protobuf' },
            }).arrayBuffer();

            return CartResponse.decode(new Uint8Array(responseBuffer));
        },
        onSuccess: (response) => {
            if (response.success && response.cart) {
                setCart(response.cart);
            } else {
                toast.error(response.errorCode || "Błąd podczas aktualizacji koszyka.");
            }
        },
        onError: (error: Error) => toast.error(error.message),
    });
}

export function useRemoveItemMutation() {
    const { setCart } = getCartStore();
    return useMutation({
        mutationKey: ['cart', 'removeItem'],
        mutationFn: async ({ productId }: { productId: number }): Promise<CartResponse> => {
            const responseBuffer = await api.delete(`cart/items/${productId}`).arrayBuffer();
            return CartResponse.decode(new Uint8Array(responseBuffer));
        },
        onSuccess: (response) => {
            if (response.success && response.cart) {
                toast.info("Produkt usunięty z koszyka");
                setCart(response.cart);
            } else {
                toast.error(response.errorCode || "Błąd podczas usuwania produktu.");
            }
        },
        onError: (error: Error) => toast.error(error.message),
    });
}

export function useMergeCartMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['cart', 'merge'],
        mutationFn: async (): Promise<CartResponse> => {
            const responseBuffer = await api.post('cart/merge').arrayBuffer();
            return CartResponse.decode(new Uint8Array(responseBuffer));
        },
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: ['cart'] });
            } else {
                toast.error(response.errorCode || "Nie udało się połączyć koszyków.")
            }
        },
        onError: (error: Error) => toast.error(`Błąd scalania koszyka: ${error.message}`),
    });
}

export function useClearCartMutation() {
    const { setCart } = getCartStore();
    return useMutation({
        mutationKey: ['cart', 'clear'],
        mutationFn: async (): Promise<CartResponse> => {
            const responseBuffer = await api.delete('cart').arrayBuffer();
            return CartResponse.decode(new Uint8Array(responseBuffer));
        },
        onSuccess: (response) => {
            if (response.success && response.cart) {
                setCart(response.cart);
            } else {
                toast.error(response.errorCode || "Błąd podczas czyszczenia koszyka.");
            }
        },
        onError: (error: Error) => toast.error(error.message),
    });
}