import { useQuery } from '@tanstack/react-query';
import { api } from '../apiClient';
import {
    GetAllProductsResponse,
    ProductResponse
} from '@/generated/ecommerce/product';

export const fetchAllProducts = async (): Promise<GetAllProductsResponse> => {
    const responseBuffer = await api.get('products').arrayBuffer();
    return GetAllProductsResponse.decode(new Uint8Array(responseBuffer));
};

export const fetchProductById = async (productId: number): Promise<ProductResponse> => {
    const responseBuffer = await api.get(`products/${productId}`).arrayBuffer();
    return ProductResponse.decode(new Uint8Array(responseBuffer));
};

export function useGetAllProductsQuery() {
    return useQuery({
        queryKey: ['products', 'all'],
        queryFn: fetchAllProducts,
        select: (data) => data.products,
    });
}

export function useGetProductByIdQuery(productId: number) {
    return useQuery({
        queryKey: ['products', 'detail', productId],
        queryFn: () => fetchProductById(productId!),
        enabled: !!productId,
        select: (data) => data.product,
    });
}