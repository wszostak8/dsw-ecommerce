"use client"

import { useGetAllProductsQuery } from "@/api/queries/productQueries";
import { ProductListCard } from "./ProductListCard";
import { ProductCardSkeleton } from "./ProductListCardSkeleton";

interface ProductListProps {
    title?: string;
}

export const ProductList = ({ title = "Nasze produkty" }: ProductListProps) => {
    const { data: products, isLoading, isError, error } = useGetAllProductsQuery();

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            );
        }

        if (isError) {
            console.error("Błąd podczas pobierania produktów:", error);
            return (
                <div className="mt-6 text-center text-red-500">
                    <p>Wystąpił błąd podczas ładowania produktów. Spróbuj ponownie później.</p>
                </div>
            );
        }

        if (!products || products.length === 0) {
            return (
                <div className="mt-6 text-center text-gray-500 dark:text-neutral-400">
                    <p>Nie znaleziono produktów.</p>
                </div>
            );
        }

        return (
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                    <ProductListCard key={product.id} product={product} />
                ))}
            </div>
        );
    };

    return (
        <>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>
            {renderContent()}
        </>
    );
};