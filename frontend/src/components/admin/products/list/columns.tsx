import { ColumnDef } from "@tanstack/react-table"
import { Product } from "@/generated/ecommerce/product"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProductsTableRowActions } from "./ProductsTableRowActions"
import { formatCurrency } from "@/utils/formatCurrency";

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <Button
                className="flex pl-4 hover:bg-transparent"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="pl-4">{row.getValue("id")}</div>,
        size: 80,
    },
    {
        accessorKey: "images",
        header: "Zdjęcie",
        cell: ({ row }) => {
            const images = row.getValue("images") as string[];
            const mainImage = images?.[0];

            return (
                <div className="flex items-center">
                    {mainImage ? (
                        <img
                            src={mainImage}
                            alt={row.getValue("productName")}
                            className="h-12 w-12 border-1 rounded-md object-cover"
                        />
                    ) : (
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                    )}
                </div>
            );
        },
        size: 80,
        minSize: 80,
        maxSize: 80,
    },
    {
        accessorKey: "productName",
        header: ({ column }) => (
            <Button
                className="px-0 hover:bg-transparent"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nazwa produktu
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("productName")}</div>
        ),
        size: 300,
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <Button
                className="px-0 hover:bg-transparent"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Cena
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"))
            return <div>{formatCurrency(amount)}</div>
        },
        size: 130,
    },
    {
        accessorKey: "code",
        header: () => <div className="">Kod produktu</div>,
        cell: ({ row }) => <div className="">{row.getValue("code")}</div>,
        size: 130,
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            const status = row.getValue("status") as number;
            const statusText = status === 0 ? "AKTYWNY" : "NIEAKTYWNY";
            return (
                <div className="flex justify-center">
                    <Badge variant={status === 0 ? "default" : "destructive"}>{statusText}</Badge>
                </div>
            );
        },
        size: 120,
    },
    {
        id: "actions",
        header: () => <div className="text-right pr-4">Akcje</div>,
        cell: ({ row }) => (
            <div className="flex justify-end pr-4">
                <ProductsTableRowActions row={row} />
            </div>
        ),
        size: 100,
    },
]