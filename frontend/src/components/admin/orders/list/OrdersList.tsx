"use client"

import { useMyOrdersQuery } from "@/api/queries/orderQueries";
import { columns } from "./columns";
import { Datatable } from "@/components/admin/ui/datatable";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export function OrdersList() {
    const { data, isLoading, isError } = useMyOrdersQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner />
            </div>
        );
    }

    if (isError) {
        toast.error("Nie udało się załadować zamówień.");
        return <div className="text-destructive text-center p-8">Błąd ładowania danych.</div>;
    }

    const orders = data?.orders || [];

    return (
        <>
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Lista zamówień</h1>
        </div>

    <Datatable
        columns={columns}
        data={orders}
        defaultSorting={[{id: "orderId", desc: true}]}
        searchPlaceholder="Szukaj po numerze, imieniu, nazwisku lub adresie e-mail..."
    />
</>
)
    ;
}