"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LogOut, ShieldAlert, UserCog } from "lucide-react";
import Link from "next/link";
import { useSession } from "./providers/session-provider";
import logOutAction from "@/actions/auth/log-out";
import UserAvatar from "./user-avatar";
import { hasPermission } from "@/lib/auth/permissions";
import { Button } from "./ui/button";

export default function NavbarUserMenu() {
    const {user} = useSession();

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="rounded-full" variant="outline" size="icon">
                    <UserAvatar user={user} hideBorder/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        {user.name}
                    </DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                        <Link href="/settings/profile">
                            <UserCog className="w-4 h-4"/>
                            Account settings
                        </Link>
                    </DropdownMenuItem>
                    {hasPermission(user, "admin:access") ? (
                        <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link href="/admin">
                                <ShieldAlert className="w-4 h-4"/>
                                Admin
                            </Link>
                        </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={logOutAction} className="cursor-pointer">
                        <LogOut className="w-4 h-4"/>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
