"use client";

import { Button } from "@/components/ui/button";
import { UserCog, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsLayout({children}: Readonly<{children: React.ReactNode}>) {
    const pathname = usePathname();
    
    return(
        <div className="flex w-full">
            <div className="w-[300px]"></div>
            <div className="w-[300px] fixed flex flex-col gap-2 border p-2 rounded-xl">
                <Button 
                    className="justify-start"
                    variant={pathname.includes("/settings/account") ? "secondary" : "ghost"} 
                    asChild
                >
                    <Link href="/settings/account">
                        <UserCog className="h-5 w-5 mr-2"/>
                        Account settings
                    </Link>
                </Button>
                <Button 
                    className="justify-start"
                    variant={pathname.includes("/settings/sessions") ? "secondary" : "ghost"} 
                    asChild
                >
                    <Link href="/settings/sessions">
                        <Lock className="h-5 w-5 mr-2"/>
                        Sessions
                    </Link>
                </Button>
            </div>
            <div className="flex flex-1 justify-center">
                {children}
            </div>
            <div className="w-[300px]"></div>
        </div>
    );
}