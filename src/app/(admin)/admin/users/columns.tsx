"use client";

import UserActionDropdown from "@/components/admin/users/user-actions-dropdown";
import DataTableColumnHeader from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/user-avatar";
import UserEmail from "@/components/settings/account/user-email";
import { formatDateTimeShort } from "@/lib/date-format";
import { User } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "avatar",
        header: "Avatar",
        cell: ({row}) => (<UserAvatar user={row.original}/>)
    },
    {
        accessorKey: "name",
        header: () => (<DataTableColumnHeader accessorKey="name" label="Name"/>)
        
    },
    {
        accessorKey: "email",
        header: () => (<DataTableColumnHeader accessorKey="email" label="E-mail"/>),
        cell: ({row}) => (<UserEmail user={row.original}/>)
    },
    {
        accessorKey: "bio",
        header: "Bio",
        cell: ({row}) => (
            <div className="max-w-50 line-clamp-2 whitespace-pre-line text-wrap">
                {row.original.bio}
            </div>
        )
    },
    {
        accessorKey: "role",
        header: () => (<DataTableColumnHeader accessorKey="role" label="Role"/>)
    },
    {
        accessorKey: "verified",
        header: "Verified",
        cell: ({row}) => (
            <Badge variant={row.original.verified ? "secondary" : "destructive"}>
                {row.original.verified ? "Verified" : "Unverified"}
            </Badge>
        )
    },
    {
        accessorKey: "blocked",
        header: "Blocked",
        cell: ({row}) => (
            <Badge variant={row.original.blocked ? "destructive" : "secondary"}>
                {row.original.blocked ? "Blocked" : "Active"}
            </Badge>
        )
    },
    {
        accessorKey: "createdAt",
        header: () => (<DataTableColumnHeader accessorKey="createdAt" label="Created at"/>),
        cell: ({row}) => formatDateTimeShort(row.original.createdAt)
    },
    {
        id: "actions",
        cell: ({row}) => (<UserActionDropdown row={row}/>)
    }
];