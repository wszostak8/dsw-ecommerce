import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../apiClient';
import {
    CreateOrderRequest,
    OrderAddress,
    OrderResponse, OrderStatus, UpdateOrderStatusRequest
} from '@/generated/ecommerce/order';

export function useCreateOrderMutation() {
    return useMutation({
        mutationKey: ['orders', 'create'],
        mutationFn: async (addressData: OrderAddress): Promise<OrderResponse> => {
            const requestMessage = CreateOrderRequest.create({
                address: OrderAddress.create(addressData)
            });

            const binaryBody = CreateOrderRequest.encode(requestMessage).finish();
            const safeBinaryBody = new Uint8Array(binaryBody);

            const responseBuffer = await api.post('orders', {
                body: new Blob([safeBinaryBody]),
                headers: { 'Content-Type': 'application/x-protobuf' },
            }).arrayBuffer();

            return OrderResponse.decode(new Uint8Array(responseBuffer));
        },
        onSuccess: (response) => {
            if (response.success && response.order) {
                toast.success("Zamówienie zostało złożone.");
            } else {
                toast.error(response.errorCode || "Wystąpił błąd podczas składania zamówienia.");
            }
        },
        onError: (error: Error) => {
            toast.error(`Błąd połączenia: ${error.message}`);
        },
    });
}

export function useUpdateOrderStatusMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['orders', 'updateStatus'],
        mutationFn: async ({ orderId, status }: { orderId: string, status: OrderStatus }): Promise<OrderResponse> => {
            const requestMessage = UpdateOrderStatusRequest.create({
                status: status
            });

            const binaryBody = UpdateOrderStatusRequest.encode(requestMessage).finish();
            const safeBinaryBody = new Uint8Array(binaryBody);

            const responseBuffer = await api.put(`orders/${orderId}/status`, {
                body: new Blob([safeBinaryBody]),
                headers: { 'Content-Type': 'application/x-protobuf' },
            }).arrayBuffer();

            return OrderResponse.decode(new Uint8Array(responseBuffer));
        },
        onSuccess: (data, variables) => {
            if (data.success) {
                toast.success("Status zamówienia został zmieniony");
                queryClient.invalidateQueries({ queryKey: ['orders', variables.orderId] });
                queryClient.invalidateQueries({ queryKey: ['orders', 'all'] });
            } else {
                toast.error("Nie udało się zmienić statusu");
            }
        },
        onError: (err) => toast.error(err.message)
    });
}
