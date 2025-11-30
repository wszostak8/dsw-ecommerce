import { useQuery } from '@tanstack/react-query';
import { api } from '../apiClient';
import { AddressResponse } from "@/generated/ecommerce/address";

const fetchAddress = async (): Promise<AddressResponse> => {
    const responseBuffer = await api.get('address/me').arrayBuffer();
    return AddressResponse.decode(new Uint8Array(responseBuffer));
};

export function useAddressQuery(enabled: boolean = true) {
    return useQuery({
        queryKey: ['address'],
        queryFn: fetchAddress,
        retry: false,
        refetchOnWindowFocus: true,
        enabled: enabled
    });
}