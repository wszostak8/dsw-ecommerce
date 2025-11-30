import { Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteProductMutation } from "@/api/mutations/productMutations"
import { Product } from "@/generated/ecommerce/product"
import { useRouter } from "next/navigation";

interface DataTableRowActionsProps {
    row: Row<Product>
}

export function ProductsTableRowActions({ row }: DataTableRowActionsProps) {
    const product = row.original;
    const deleteMutation = useDeleteProductMutation();
    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Otwórz menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(product.id))}>
                    Kopiuj ID produktu
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={ () => router.push(`/admin/products/details/${product.id}`)}>Edytuj produkt</DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/90 focus:text-white"
                    onClick={() => deleteMutation.mutate(product.id)}
                    disabled={deleteMutation.isPending}
                >
                    Usuń produkt
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}