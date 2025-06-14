"use client"

import { 
    ColumnDef, flexRender, getCoreRowModel, 
    useReactTable, getPaginationRowModel, SortingState, 
    getSortedRowModel, ColumnFiltersState 
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react";

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends unknown> {
        removeRowById?: (id: string) => void;
    }
}

interface DataTableProps<TData extends {id: string}, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    showPagination?: boolean;
    showSearch?: boolean;
}

export function DataTable<TData extends {id: string}, TValue>({columns, data: defaultData}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [data, setData] = useState(() => [...defaultData]);

    const table = useReactTable({
        data, 
        columns, 
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            columnFilters
        },
        meta: {
            removeRowById: (id: string) => {
                setData(old => old.filter(row => row.id !== id));
            }
        }
    });

    useEffect(() => {
        setData([...defaultData]);
    }, [defaultData]);

    return(
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}