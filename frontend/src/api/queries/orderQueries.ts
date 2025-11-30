import { useQuery } from '@tanstack/react-query';
import { api } from '../apiClient';
import { GetUserOrdersResponse, OrderResponse } from '@/generated/ecommerce/order';

const fetchMyOrders = async (): Promise<GetUserOrdersResponse> => {
    const responseBuffer = await api.get('orders').arrayBuffer();
    return GetUserOrdersResponse.decode(new Uint8Array(responseBuffer));
};

export function useMyOrdersQuery() {
    return useQuery({
        queryKey: ['orders', 'my'],
        queryFn: fetchMyOrders,
        staleTime: 1000 * 60 * 5,
    });
}

const fetchOrderById = async (id: string): Promise<OrderResponse> => {
    const responseBuffer = await api.get(`orders/${id}`).arrayBuffer();
    return OrderResponse.decode(new Uint8Array(responseBuffer));
};

export function useGetOrderQuery(id: string) {
    return useQuery({
        queryKey: ['orders', id],
        queryFn: () => fetchOrderById(id),
        enabled: !!id,
    });
}