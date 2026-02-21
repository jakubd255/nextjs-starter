"use client";

import { ChevronDown, ChevronsUpDown, ChevronUp, X } from "lucide-react";
import { 
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, 
    DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import useTableQuery from "@/lib/hooks/use-table-query";

interface DataTableColumnHeaderProps {
    accessorKey: string;
    label: string;
}

export default function DataTableColumnHader({accessorKey, label}: DataTableColumnHeaderProps) {
    const {sort} = useTableQuery();

    const isChecked = (order?: string | null) => {
        return sort.field === accessorKey && order === sort.order;
    }

    const handleSetAsc = () => {
        sort.set(accessorKey, "asc");
    }

    const handleSetDesc = () => {
        sort.set(accessorKey, "desc");
    }

    const handleReset = () => {
        sort.set(null, null);
    }

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="px-0! rounded-none" variant="ghost">
                    {label}
                    {isChecked("asc") ? (
                        <ChevronUp className="w-4 h-4"/>
                    ) : isChecked("desc") ? (
                        <ChevronDown className="w-4 h-4"/>
                    ) : (
                        <ChevronsUpDown className="w-4 h-4"/>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuCheckboxItem checked={isChecked("asc")} onClick={(handleSetAsc)}>
                        <ChevronUp className="w-4 h-4"/>
                        Asc
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={isChecked("desc")} onClick={handleSetDesc}>
                        <ChevronDown className="w-4 h-4"/>
                        Desc
                    </DropdownMenuCheckboxItem>
                    {sort.field === accessorKey && sort.order ? (
                        <DropdownMenuItem onClick={handleReset}>
                            <X className="w-4 h-4"/>
                            Reset
                        </DropdownMenuItem>
                    ) : null}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}