"use client";

import UserAvatar from "./user-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LogOut, UserCog } from "lucide-react";
import logoutAction from "@/server-actions/logout-action";
import Link from "next/link";
import { useSession } from "./providers/session-provider";

export default function NavbarUserMenu() {
    const {user} = useSession();
    const handleLogout = async () => await logoutAction();

    return(
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar user={user}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        {user.name}
                    </DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                        <Link href="/settings/account">
                            <UserCog className="mr-2 w-4 h-4"/>
                            Account settings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                        <LogOut className="mr-2 w-4 h-4"/>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}