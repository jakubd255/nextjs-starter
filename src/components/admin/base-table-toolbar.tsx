import { ReactNode } from "react";
import DataTableSearch from "../data-table/data-table-search";
import { Separator } from "../ui/separator";
import DataTableReset from "../data-table/data-table-reset";

interface BaseTableToolbarProps {
    resetKeys: string[];
    children?: ReactNode;
}

export function BaseTableToolbar({ resetKeys, children }: BaseTableToolbarProps) {
    const allResetKeys = ["search", ...resetKeys];
    const hasFilters = !!children;

    return(
        <div className="flex gap-2">
            <DataTableSearch />
            {hasFilters && <Separator orientation="vertical"/>}
            {children}            
            <DataTableReset keys={allResetKeys} showSeparator={hasFilters} />
        </div>
    );
}