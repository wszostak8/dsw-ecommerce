import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../apiClient';
import {
    CreateProductRequest,
    UpdateProductRequest,
    DeleteProductRequest,
    ProductResponse,
    DeleteProductResponse,
} from '@/generated/ecommerce/product';
import { FileWithPreview } from "@/hooks/use-file-upload";

type CreateProductPayload = {
    productData: CreateProductRequest;
    files: FileWithPreview[];
};

export function useCreateProductMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['products', 'create'],
        mutationFn: async ({ productData, files }: CreateProductPayload): Promise<ProductResponse> => {

            // SCENARIUSZ 1: Brak plików - wysyłamy proste żądanie Protobuf
            if (files.length === 0) {
                const requestMessage = CreateProductRequest.create(productData);
                const binaryBody = CreateProductRequest.encode(requestMessage).finish();
                const safeBinaryBody = new Uint8Array(binaryBody);

                const responseBuffer = await api.post('products', {
                    body: new Blob([safeBinaryBody]),
                    headers: { 'Content-Type': 'application/x-protobuf' }
                }).arrayBuffer();

                return ProductResponse.decode(new Uint8Array(responseBuffer));
            }

            // SCENARIUSZ 2: Są pliki - wysyłamy żądanie multipart/form-data
            else {
                const formData = new FormData();
                const requestMessage = CreateProductRequest.create(productData);
                const binaryBody = CreateProductRequest.encode(requestMessage).finish();
                const safeBinaryBody = new Uint8Array(binaryBody);
                formData.append('product', new Blob([safeBinaryBody], { type: 'application/x-protobuf' }));

                files.forEach(fileWrapper => {
                    formData.append('images', fileWrapper.file as File);
                });

                const responseBuffer = await api.post('products', {
                    body: formData,
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'application/x-protobuf',
                    }
                }).arrayBuffer();

                return ProductResponse.decode(new Uint8Array(responseBuffer));
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Dodano produkt pomyślnie.");
                queryClient.invalidateQueries({ queryKey: ['products', 'all'] });
            } else {
                toast.error(response.errorCode || "Błąd przy dodawaniu produktu.");
            }
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export function useUpdateProductMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['products', 'update'],
        mutationFn: async (productData: UpdateProductRequest): Promise<ProductResponse> => {
            if (!productData.id) {
                throw new Error("ID produktu jest wymagane do aktualizacji.");
            }

            const requestMessage = UpdateProductRequest.create(productData);
            const binaryBody = UpdateProductRequest.encode(requestMessage).finish();

            const responseBuffer = await api.put(`products/${productData.id}`, {
                body: new Blob([binaryBody]),
            }).arrayBuffer();

            return ProductResponse.decode(new Uint8Array(responseBuffer));
        },

        onSuccess: (response) => {
            if (response.success && response.product) {
                toast.success("Produkt zaktualizowany pomyślnie.");

                queryClient.invalidateQueries({ queryKey: ['products', 'all'] });
                queryClient.invalidateQueries({ queryKey: ['products', 'detail', response.product.id] });

            } else {
                let errorMessage = "Błąd podczas aktualizacji produktu.";

                switch (response.errorCode) {
                    case "PRODUCT_NOT_FOUND":
                        errorMessage = "Produkt o podanym ID nie został znaleziony.";
                        break;
                    case "ID_MISMATCH":
                        errorMessage = "Wystąpiła niezgodność identyfikatorów produktu.";
                        break;
                    case "PRODUCT_CODE_EXISTS":
                        errorMessage = "Produkt z takim kodem już istnieje w bazie.";
                        break;
                    case "PRODUCT_EAN_EXISTS":
                        errorMessage = "Produkt z takim kodem EAN już istnieje w bazie.";
                        break;
                    case "DUPLICATE_KEY":
                        errorMessage = "Wystąpił błąd zduplikowanego klucza.";
                        break;
                }

                toast.error(errorMessage);
            }
        },

        onError: (error: Error) => {
            toast.error(error.message || "Wystąpił nieoczekiwany błąd serwera.");
        },
    });
}

export function useDeleteProductMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['products', 'delete'],
        mutationFn: async (productId: number): Promise<DeleteProductResponse> => {
            const requestMessage = DeleteProductRequest.create({ id: productId });
            const binaryBody = DeleteProductRequest.encode(requestMessage).finish();
            const safeBinaryBody = new Uint8Array(binaryBody);

            const responseBuffer = await api.delete(`products/${productId}`, {
                body: new Blob([safeBinaryBody]),
            }).arrayBuffer();

            return DeleteProductResponse.decode(new Uint8Array(responseBuffer));
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Produkt usunięty pomyślnie.");
                queryClient.invalidateQueries({ queryKey: ['products', 'all'] });
            } else {
                toast.error(response.errorCode || "Błąd przy usuwaniu produktu.");
            }
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}