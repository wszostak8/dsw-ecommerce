import { ColumnDef } from "@tanstack/react-table"
import { Order } from "@/generated/ecommerce/order"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { OrderTableRowActions } from "./OrderTableRowActions"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate, mapOrderStatusToUi } from "@/utils/orderUImapper"

export const columns: ColumnDef<Order>[] = [
    {
        accessorKey: "orderId",
        header: ({ column }) => (
            <Button
                className="flex pl-4"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nr zamówienia
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="pl-4 font-medium">{row.getValue("orderId")}</div>,
        size: 150,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
                className="px-0 hover:bg-transparent"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Data złożenia
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
        size: 180,
    },
    {
        id: "customer",
        header: "Klient",
        // pełny ciąg do wyszukiwania.
        accessorFn: (row) => {
            const a = row.address;
            if (!a) return "";
            // Zwracamy np: "Jan Kowalski jan@gmail.com"
            return `${a.firstName || ''} ${a.lastName || ''} ${a.email || ''}`.trim();
        },
        cell: ({ row }) => {
            const address = row.original.address;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{address?.firstName} {address?.lastName}</span>
                    <span className="text-xs text-muted-foreground">{address?.email}</span>
                </div>
            )
        },
        size: 250,
    },
    {
        accessorKey: "totalAmount",
        header: ({ column }) => (
            <Button
                className="px-0 hover:bg-transparent"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Kwota
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalAmount"))
            return <div className="font-medium">{formatCurrency(amount)}</div>
        },
        size: 120,
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            const statusEnum = row.original.status;
            const { variant, label } = mapOrderStatusToUi(statusEnum);

            const badgeVariant =
                variant === 'shipped' ? 'secondary' :
                    variant === 'cancelled' ? 'destructive' :
                        'default';

            return (
                <div className="flex justify-center">
                    <Badge variant={badgeVariant}>{label}</Badge>
                </div>
            );
        },
        size: 150,
    },
    {
        id: "actions",
        header: () => <div className="text-right pr-4">Akcje</div>,
        cell: ({ row }) => (
            <div className="flex justify-end pr-4">
                <OrderTableRowActions row={row} />
            </div>
        ),
        size: 100,
    },
]