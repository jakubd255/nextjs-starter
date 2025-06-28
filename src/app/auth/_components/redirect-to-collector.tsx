"use client";

import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";

export default function RedirectToCollector() {
    const params = useSearchParams();
    const redirectTo = params.get("redirectTo") || "/";

    return(
        <Input 
            type="hidden" 
            name="redirectTo" 
            value={redirectTo}
        />
    );
}