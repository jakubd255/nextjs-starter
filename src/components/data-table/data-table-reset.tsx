"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { updateSearchParams } from "@/lib/params";
import { X } from "lucide-react";
import { Separator } from "../ui/separator";

interface DataTableResetProps {
    keys: string[];
    showSeparator?: boolean;
}

export default function DataTableReset({keys = [], showSeparator=false}: DataTableResetProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = searchParams.get("page");
    const sortField = searchParams.get("sortField");
    const sortOrder = searchParams.get("sortOrder");
    

    const handleReset = () => {
        updateSearchParams(router, {page, sortField, sortOrder}, {resetPage: true, clearOthers: true})
    }

    const values = keys.map((key) => searchParams.get(key));
    const isHidden = values.every((v) => v === null || v === undefined);

    if(isHidden) return null;

    return(
        <>
            {showSeparator ? (<Separator orientation="vertical"/>) : null}
            <Button variant="outline" onClick={handleReset}>
                <X className="w-4 h-4"/>
                Reset
            </Button>
        </>
    );
}