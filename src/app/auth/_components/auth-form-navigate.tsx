"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface AuthFormNavigateProps {
    text: string;
    href: string;
    name: string;
}

export default function AuthFormNavigate({text, href, name}: AuthFormNavigateProps) {
    const params = useSearchParams();
    const redirectTo = params.get("redirectTo") || "/";
    
    return(
        <div>
            {text} &nbsp;
            <Link 
                href={`${href}?redirectTo=${encodeURIComponent(redirectTo)}`} 
                className="font-bold hover:underline"
            >
                {name}
            </Link>
        </div>
    );
}