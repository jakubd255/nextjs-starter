"use client";

import resendVerifyUserAction from "@/actions/users/resend-verify-user";
import DialogLauncher from "@/components/dialog-launcher";
import { useSession } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { handleActionResult } from "@/lib/utils/action-result";
import { hasPermission } from "@/lib/auth/permissions";
import { Row } from "@tanstack/react-table";
import { BadgeCheck, Ellipsis, LinkIcon, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DeleteUserDialog from "./delete-user-dialog";
import { User } from "@/db/schema/users";

interface UsersTableActionsProps {
    row: Row<User>;
}

export default function UserActionDropdown({row}: UsersTableActionsProps) {
    const user = row.original;

    const {user: sessionUser} = useSession();

    const [open, setOpen] = useState(false);

    const handleResendToken = async () => {
        const result = await resendVerifyUserAction(user.id);
        console.log(result);
        handleActionResult(result);
    }

    const permissions = {
        profile: hasPermission(sessionUser, "user:update:profile"),
        oAuth: hasPermission(sessionUser, "oauth:read"),
        tokenResend: hasPermission(sessionUser, "token:resend"),
        delete: hasPermission(sessionUser, "user:delete")
    }
    const hasAnyPermission = Object.values(permissions).some(Boolean);
    if(!hasAnyPermission) return null;

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Ellipsis className="w-4 h-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {permissions.profile ? (
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}`}>
                            <Pencil className="w-4 h-4"/>
                            Edit
                        </Link>
                    </DropdownMenuItem>
                ) : null}
                {permissions.oAuth ? (
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/accounts?userId=${user.id}`}>
                            <LinkIcon className="w-4 h-4"/>
                            Connected accounts
                        </Link>
                    </DropdownMenuItem>
                ) : null}
                {permissions.tokenResend? (
                    <DropdownMenuItem 
                        onClick={handleResendToken} 
                        disabled={user.verified && !user.pendingEmail}
                    >
                        <BadgeCheck className="w-4 h-4"/>
                        Resend verification token
                    </DropdownMenuItem>
                ) : null}
                {permissions.delete && user.id !== sessionUser.id ? (
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
                    <DeleteUserDialog user={user} onSuccess={() => setOpen(false)}/>
                </DialogLauncher>
            ) : null}
        </DropdownMenu>
    );
}