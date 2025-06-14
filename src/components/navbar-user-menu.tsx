"use client";

import UserAvatar from "./user-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LogOut, ShieldAlert, UserCog } from "lucide-react";
import Link from "next/link";
import { useSession } from "./providers/session-provider";
import logOut from "@/actions/session/logout";

export default function NavbarUserMenu() {
    const {user} = useSession();

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
                    {user.role === "ADMIN" ? (
                        <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link href="/admin/users">
                                <ShieldAlert className="mr-2 w-4 h-4"/>
                                Admin
                            </Link>
                        </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem onClick={logOut} className="cursor-pointer">
                        <LogOut className="mr-2 w-4 h-4"/>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}