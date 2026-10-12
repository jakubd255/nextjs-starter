"use client";

import { LogOut, ShieldAlert, UserCog } from "lucide-react";
import logOutAction from "@/actions/auth/log-out";
import UserAvatar from "./kit/user-avatar";
import { hasPermission } from "@/lib/auth/permissions";
import ActionsMenu from "./kit/actions-menu";
import { User } from "lucia";

interface Props {
    user: User;
}

export default function NavbarUserMenu({user}: Props) {
    return(
        <ActionsMenu
            trigger={<UserAvatar user={user} hideBorder/>}
            triggerVariant="outline"
            triggerClassName="rounded-full"
            entries={[
                {heading: user.name},
                {
                    label: "Account settings", 
                    icon: UserCog, 
                    href: "/settings/profile"
                },
                {
                    label: "Admin dashboard", 
                    icon: ShieldAlert, 
                    href: "/admin",
                    hidden: !hasPermission(user, "admin:access")
                },
                {
                    label: "Log out", 
                    icon: LogOut, 
                    onSelect: logOutAction
                }
            ]}
        />
    );
}