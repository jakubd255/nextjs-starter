"use client";

import resendVerifyUserAction from "@/actions/users/resend-verify-user";
import { useSession } from "@/components/providers/session-provider";
import { handleActionResult } from "@/lib/utils/action-result";
import { hasPermission } from "@/lib/auth/permissions";
import { Row } from "@tanstack/react-table";
import { BadgeCheck, LinkIcon, Pencil, Trash2 } from "lucide-react";
import DeleteUserDialog from "./delete-user-dialog";
import { User } from "@/db/schema/users";
import ActionsMenu from "@/components/kit/actions-menu";

interface Props {
    row: Row<User>;
}

export default function UserActionDropdown({row}: Props) {
    const user = row.original;
    const {user: sessionUser} = useSession();

    const handleResendToken = async () => {
        const result = await resendVerifyUserAction(user.id);
        handleActionResult(result);
    }

    return(
        <ActionsMenu entries={[
            {
                label: "Edit", 
                icon: Pencil, 
                hidden: !hasPermission(sessionUser, "user:update:profile"),
                href: `/admin/users/${user.id}`
            },
            {
                label: "Connected accounts", 
                icon: LinkIcon, 
                hidden: !hasPermission(sessionUser, "oauth:read"),
                href: `/admin/accounts?userId=${user.id}` 
            },
            { 
                label: "Resend verification token", 
                icon: BadgeCheck, 
                hidden: !hasPermission(sessionUser,"token:resend"),
                disabled: user.verified && !user.pendingEmail,
                onSelect: handleResendToken
            },
            { 
                label: "Delete", 
                icon: Trash2, 
                destructive: true,
                hidden: !hasPermission(sessionUser, "user:delete") || user.id === sessionUser.id,
                dialog: <DeleteUserDialog user={user}/>
            }
        ]}/>
    );
}