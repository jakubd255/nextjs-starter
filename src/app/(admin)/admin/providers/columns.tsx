"use client";

import DataTableColumnHeader from "@/components/data-table/data-table-column-header";
import { formatDateTimeShort } from "@/lib/date-format";
import { Provider } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Provider>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "userId",
        header: "User Id",
    },
    {
        accessorKey: "provider",
        header: () => (<DataTableColumnHeader accessorKey="provider" label="Provider"/>)
    },
    {
        accessorKey: "providerUserId",
        header: "Provider User Id",
    },
    {
        accessorKey: "createdAt",
        header: () => (<DataTableColumnHeader accessorKey="createdAt" label="Created at"/>),
        cell: ({row}) => formatDateTimeShort(row.original.createdAt)
    }
];