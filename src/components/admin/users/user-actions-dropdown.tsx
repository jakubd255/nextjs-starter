"use client";

import deleteUserAction from "@/actions/users/delete-user";
import resendVerifyUserAction from "@/actions/users/resend-verify-user";
import { useSession } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { handleActionResult } from "@/lib/action-result";
import { hasPermission } from "@/lib/auth/permissions";
import { User } from "@/lib/types";
import { Row } from "@tanstack/react-table";
import { BadgeCheck, Ellipsis, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface UsersTableActionsProps {
    row: Row<User>
}

export default function UserActionDropdown({row}: UsersTableActionsProps) {
    const user = row.original;

    const {user: sessionUser} = useSession();

    const handleResetToken = async () => {
        const result = await resendVerifyUserAction(user.id);
        handleActionResult(result, "Successfully resent verification token");
    }

    const handleDeleteUser = async () => {
        const result = await deleteUserAction(user.id);
        handleActionResult(result, "Successfully deleted user");
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
                        onClick={handleDeleteUser} 
                        disabled={user.id === sessionUser.id}
                    >
                        <Trash2 className="w-4 h-4"/>
                        Delete
                    </DropdownMenuItem>
                ) : null}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}