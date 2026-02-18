"use client";

import { Button } from "@/components/ui/button";
import { ClipboardClock, Settings, User, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsNavigation() {
    const pathname = usePathname();

    const pages = [
        {
            label: "Profile",
            path: "/settings/profile",
            icon: User
        },
        {
            label: "Account",
            path: "/settings/account",
            icon: Settings
        },
        {
            label: "Connected accounts",
            path: "/settings/connections",
            icon: LinkIcon
        },
        {
            label: "Sessions",
            path: "/settings/sessions",
            icon: ClipboardClock
        }
    ];

    return(
        <div className="w-full md:w-70 flex flex-col gap-2">
            {pages.map((page) => (
                <Button 
                    className="justify-start" 
                    variant={pathname.includes(page.path) ? "secondary" : "ghost"} 
                    key={page.path}
                    asChild
                >
                    <Link href={page.path}>
                        <page.icon/>
                        {page.label}
                    </Link>
                </Button>
            ))}
        </div>
    );
}