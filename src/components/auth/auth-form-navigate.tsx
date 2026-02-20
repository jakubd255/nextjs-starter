"use client";

import useRedirectTo from "@/lib/hooks/use-redirect-to";
import Link from "next/link";

interface AuthFormNavigateProps {
    text: string;
    href: string;
    name: string;
}

export default function AuthFormNavigate({text, href, name}: AuthFormNavigateProps) {
    const redirectTo = useRedirectTo();
    
    return(
        <div>
            {text} &nbsp;
            <Link href={{pathname: href, query: redirectTo}} className="font-bold hover:underline">
                {name}
            </Link>
        </div>
    );
}