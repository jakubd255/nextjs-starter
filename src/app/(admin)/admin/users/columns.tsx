"use client";

import deleteUserAction from "@/actions/user/delete-user";
import EmailStatus from "@/components/email-status";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UserAvatar from "@/components/user-avatar";
import { User } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table"
import { Trash2 } from "lucide-react";

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({row}) => (
            <div className="max-w-[200px] truncate whitespace-nowrap overflow-hidden">
                {row.original.name}
            </div>
        )
    },
    {
        accessorKey: "avatar",
        header: "Avatar",
        cell: ({row}) => (
            <UserAvatar user={row.original}/>
        )
    },
    {
        accessorKey: "emails",
        header: "Emails",
        cell: ({row}) => (
            <ul className="max-w-[300px] truncate whitespace-nowrap overflow-hidden">
                {row.original.emails?.map(email => (
                    <li className="flex gap-1" key={email.id}>
                        {email.email} <EmailStatus email={email}/>
                    </li>
                ))}
            </ul>
        )
    },
    {
        accessorKey: "bio",
        header: "Bio",
        cell: ({row}) => (
            <div className="max-w-[200px] truncate whitespace-nowrap overflow-hidden">
                {row.original.bio}
            </div>
        )
    },
    {
        accessorKey: "role",
        header: "Role"
    },
    {
        id: "actions",
        cell: ({row, table}) => (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="!h-8 !w-8">
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Delete user
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure to delete this user? 
                            This action cannot be undone and will permanently remove the user&apos;s data from the system.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button variant="destructive" onClick={async () => {
                                const {id} = row.original;
                                await deleteUserAction(id);
                                table.options.meta?.removeRowById?.(id);
                            }}>
                                Delete
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }
];