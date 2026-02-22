"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function AccountLinkErrorToast() {
    useEffect(() => {
        const value = document.cookie
            .split("; ")
            .find(row => row.startsWith("oauth_error="))
            ?.split("=")[1];

        if(value === "account_conflict") {
            requestAnimationFrame(() => {
                toast.error("Account linking failed", {
                    position: "top-center"
                });
            });
            document.cookie = "oauth_error=; Max-Age=0; path=/";
        }
    }, []);

    return null;
}