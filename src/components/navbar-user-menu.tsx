"use client";

import { LogOut, ShieldAlert, UserCog } from "lucide-react";
import logOutAction from "@/actions/auth/log-out";
import UserAvatar from "./kit/user-avatar";
import { hasPermission } from "@/lib/auth/permissions";
import { useSession } from "./providers/session-provider";
import ActionsMenu from "./kit/actions-menu";

export default function NavbarUserMenu() {
    const {user} = useSession();

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
