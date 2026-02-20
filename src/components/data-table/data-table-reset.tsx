"use client";

import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Separator } from "../ui/separator";
import useTableQuery from "@/lib/hooks/use-table-query";

interface DataTableResetProps {
    keys: string[];
    showSeparator?: boolean;
}

export default function DataTableReset({keys = [], showSeparator=false}: DataTableResetProps) {
    const { params, filter } = useTableQuery();

    const values = keys.map((key) => params[key]);
    const isHidden = values.every((v) => v === null || v === undefined);

    if(isHidden) return null;

    return(
        <>
            {showSeparator ? (<Separator orientation="vertical"/>) : null}
            <Button variant="outline" onClick={filter.clearAll}>
                <X className="w-4 h-4"/>
                Reset
            </Button>
        </>
    );
}