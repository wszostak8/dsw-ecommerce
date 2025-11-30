import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    defaultSorting?: SortingState
    searchPlaceholder?: string
}

export function Datatable<TData, TValue>({ columns, data, defaultSorting = [], searchPlaceholder = "Filtruj..." }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>(defaultSorting)
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination,
        },
        globalFilterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId);
            const stringValue = String(value ?? "").toLowerCase();
            const searchString = String(filterValue).toLowerCase();

            return stringValue.includes(searchString);
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={searchPlaceholder}
                    value={globalFilter ?? ""}
                    onChange={(event) =>
                        setGlobalFilter(event.target.value)
                    }
                    className="max-w-md pl-9 bg-white"
                />
            </div>
            <div className="border bg-white dark:bg-neutral-900">
                <Table>
                    <TableHeader className="bg-accent">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        style={{
                                            width: header.getSize(),
                                            minWidth: header.getSize(),
                                            maxWidth: header.getSize(),
                                        }}
                                    >
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            style={{
                                                width: cell.column.getSize(),
                                                minWidth: cell.column.getSize(),
                                                maxWidth: cell.column.getSize(),
                                            }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Nie znaleziono wyników.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Strona {table.getState().pagination.pageIndex + 1} z {table.getPageCount()}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Poprzednia
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Następna
                </Button>
            </div>
        </div>
    )
}