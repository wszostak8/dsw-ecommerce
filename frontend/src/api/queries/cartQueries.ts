import { useQuery } from '@tanstack/react-query';
import { api } from '../apiClient';
import { CartResponse } from '@/generated/ecommerce/cart';

const fetchCart = async (): Promise<CartResponse> => {
    const responseBuffer = await api.get('cart').arrayBuffer();
    return CartResponse.decode(new Uint8Array(responseBuffer));
};

export function useCartQuery() {
    return useQuery({
        queryKey: ['cart'],
        queryFn: fetchCart,
        retry: false,
        refetchOnWindowFocus: true,
    });
}