"use client";

import { AuditLog } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/data-table/data-table-column-header";
import { formatDateTimeShort } from "@/lib/date-format";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<AuditLog>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "action",
        header: () => (<DataTableColumnHeader accessorKey="action" label="Action"/>),
        cell: ({row}) => (
            <Badge variant="secondary">
                {row.original.action}
            </Badge>
        )
    },
    {
        accessorKey: "actorId",
        header: "User Id",
        cell: ({row}) => (<span className="font-mono text-xs">{row.original.actorId || "System"}</span>)
    },
    {
        accessorKey: "targetUserId",
        header: "Target user Id",
        cell: ({row}) => (<span className="font-mono text-xs">{row.original.targetUserId || "-"}</span>)
    },
    {
        accessorKey: "ip",
        header: () => (<DataTableColumnHeader accessorKey="ip" label="IP Address" />),
        cell: ({row}) => (<span className="font-mono text-xs">{row.original.ip || "N/A"}</span>)
    },
    {
        accessorKey: "device",
        header: "Device / Browser",
        cell: ({row}) => {
            const device = row.original.device;
            if(!device) return <span className="text-muted-foreground">-</span>;
            return(
                <div className="flex flex-col text-xs">
                    <span className="font-medium">
                        {device.os}
                    </span>
                    <span className="text-muted-foreground">
                        {device.browser || "Unknown Browser"}
                    </span>
                </div>
            );
        }
    },
    {
        accessorKey: "createdAt",
        header: () => (<DataTableColumnHeader accessorKey="createdAt" label="Created at"/>),
        cell: ({row}) => formatDateTimeShort(row.original.createdAt)
    }
];