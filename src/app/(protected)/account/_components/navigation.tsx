"use client";

import { Button } from "@/components/ui/button";
import { UserCog, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
    const pathname = usePathname();
    
    return(
        <div className="w-[280px] fixed flex flex-col gap-2 border p-2 rounded-xl">
            <Button 
                className="justify-start"
                variant={pathname.includes("/account") && !pathname.includes("/account/") ? "secondary" : "ghost"} 
                asChild
            >
                <Link href="/account">
                    <UserCog className="h-5 w-5 mr-2"/>
                    Account settings
                </Link>
            </Button>
            <Button 
                className="justify-start"
                variant={pathname.includes("/account/sessions") ? "secondary" : "ghost"} 
                asChild
            >
                <Link href="/account/sessions">
                    <Lock className="h-5 w-5 mr-2"/>
                    Sessions
                </Link>
            </Button>
        </div>
    );
}