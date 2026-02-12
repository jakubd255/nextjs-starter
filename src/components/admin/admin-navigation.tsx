"use client";

import { Button } from "@/components/ui/button";
import { Home, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavigation() {
    const pathname = usePathname();

    const pages = [
        {
            label: "Dashboard",
            path: "/admin",
            cancelPath: "/admin/",
            icon: Home
        },
        {
            label: "Users",
            path: "/admin/users",
            icon: Users
        }
    ];

    return(
        <div className="w-70 flex flex-col gap-2">
            {pages.map((page) => (
                <Button 
                    className="justify-start" 
                    variant={pathname.includes(page.path) && !pathname.includes(page.cancelPath!) ? "secondary" : "ghost"} 
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