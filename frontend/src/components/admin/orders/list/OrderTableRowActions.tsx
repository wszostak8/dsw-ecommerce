"use client"

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
import { Order } from "@/generated/ecommerce/order"
import { useRouter } from "next/navigation"

interface OrderTableRowActionsProps {
    row: Row<Order>
}

export function OrderTableRowActions({ row }: OrderTableRowActionsProps) {
    const order = row.original;
    const router = useRouter();

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
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.orderId)}>
                    Kopiuj nr zamówienia
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/admin/orders/${order.orderId}`)}>
                    Szczegóły zamówienia
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}