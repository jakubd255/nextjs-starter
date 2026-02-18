"use client";

import deleteUserAction from "@/actions/users/delete-user";
import resendVerifyUserAction from "@/actions/users/resend-verify-user";
import DialogLauncher from "@/components/dialog-launcher";
import { useSession } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActionResult, handleActionResult } from "@/lib/action-result";
import { hasPermission } from "@/lib/auth/permissions";
import { User } from "@/lib/types";
import { Row } from "@tanstack/react-table";
import { BadgeCheck, Ellipsis, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DeleteUserDialog from "./delete-user-dialog";

interface UsersTableActionsProps {
    row: Row<User>
}

export default function UserActionDropdown({row}: UsersTableActionsProps) {
    const user = row.original;

    const {user: sessionUser} = useSession();

    const [open, setOpen] = useState(false);

    const handleResetToken = async () => {
        const result = await resendVerifyUserAction(user.id);
        handleActionResult(result, "Successfully resent verification token");
    }

    const onDeleteUser = async (result: ActionResult) => {
        handleActionResult(result, "Successfully deleted user");
        setOpen(false);
    }

    const permissions = {
        profile: hasPermission(sessionUser, "user:update:profile"),
        tokenResend: hasPermission(sessionUser, "token:resend"),
        delete: hasPermission(sessionUser, "user:delete")
    }

    if(!(permissions.profile || permissions.tokenResend || permissions.delete)) return null;

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Ellipsis className="w-4 h-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {hasPermission(sessionUser, "user:update:profile") ? (
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}`}>
                            <Pencil className="w-4 h-4"/>
                            Edit
                        </Link>
                    </DropdownMenuItem>
                ) : null}
                {hasPermission(sessionUser, "token:resend") ? (
                    <DropdownMenuItem 
                        onClick={handleResetToken} 
                        disabled={user.verified && !user.pendingEmail}
                    >
                        <BadgeCheck className="w-4 h-4"/>
                        Resend verification token
                    </DropdownMenuItem>
                ) : null}
                {hasPermission(sessionUser, "user:delete") ? (
                    <DropdownMenuItem 
                        variant="destructive" 
                        onClick={() => setOpen(true)} 
                        disabled={user.id === sessionUser.id}
                    >
                        <Trash2 className="w-4 h-4"/>
                        Delete
                    </DropdownMenuItem>
                ) : null}
            </DropdownMenuContent>
            {open ? (
                <DialogLauncher open={open} onOpenChange={setOpen}>
                    <DeleteUserDialog user={user} onDelete={onDeleteUser}/>
                </DialogLauncher>
            ) : null}
        </DropdownMenu>
    );
}