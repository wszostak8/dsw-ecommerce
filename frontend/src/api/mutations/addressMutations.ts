import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../apiClient';
import {
    Address,
    AddressResponse,
    CreateAddressRequest,
    UpdateAddressRequest
} from '@/generated/ecommerce/address';

export function useCreateAddressMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['address', 'create'],
        mutationFn: async (addressData: Partial<Address>): Promise<AddressResponse> => {
            const requestMessage = CreateAddressRequest.create({
                address: Address.create(addressData)
            });

            const binaryBody = CreateAddressRequest.encode(requestMessage).finish();
            const safeBinaryBody = new Uint8Array(binaryBody);

            const responseBuffer = await api.post('address', {
                body: new Blob([safeBinaryBody]),
                headers: { 'Content-Type': 'application/x-protobuf' },
            }).arrayBuffer();

            return AddressResponse.decode(new Uint8Array(responseBuffer));
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Adres został utworzony");
                queryClient.invalidateQueries({ queryKey: ['address'] });
            } else {
                toast.error(response.errorCode || "Błąd tworzenia adresu.");
            }
        },
        onError: (error: Error) => toast.error(error.message),
    });
}

export function useUpdateAddressMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['address', 'update'],
        mutationFn: async ({ id, addressData }: { id: string, addressData: Partial<Address> }): Promise<AddressResponse> => {

            const requestMessage = UpdateAddressRequest.create({
                id: id,
                address: Address.create({ ...addressData, id: id })
            });

            const binaryBody = UpdateAddressRequest.encode(requestMessage).finish();
            const safeBinaryBody = new Uint8Array(binaryBody);

            const responseBuffer = await api.put(`address/${id}`, {
                body: new Blob([safeBinaryBody]),
                headers: { 'Content-Type': 'application/x-protobuf' },
            }).arrayBuffer();

            return AddressResponse.decode(new Uint8Array(responseBuffer));
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Adres został zaktualizowany");
                queryClient.invalidateQueries({ queryKey: ['address'] });
            } else {
                toast.error(response.errorCode || "Błąd aktualizacji adresu.");
            }
        },
        onError: (error: Error) => toast.error(error.message),
    });
}