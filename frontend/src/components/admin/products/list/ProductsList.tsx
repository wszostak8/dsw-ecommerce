import { useGetAllProductsQuery } from "@/api/queries/productQueries";
import { columns } from "@/components/admin/products/list/columns";
import { Datatable } from "@/components/admin/ui/datatable";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import Link from "next/link";

export function ProductsList() {
    const { data: products, isLoading, isError } = useGetAllProductsQuery();

    if (isLoading) {
        return <div className="flex items-center justify-center h-64"><Spinner /></div>;
    }

    if (isError) {
        toast.error("Failed to load products. Please try again.");
        return <div className="text-destructive text-center p-8">Error loading data.</div>;
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Lista produktów</h1>
                <Link href="/admin/products/add">
                    <Button className="!h-10">
                        Dodaj produkt
                    </Button>
                </Link>
            </div>
            <Datatable
                columns={columns}
                searchPlaceholder="Filtruj po ID, kodzie produktu lub nazwie..."
                defaultSorting={[{ id: "id", desc: true }]}
                data={products || []}
            />
        </>
    );
}