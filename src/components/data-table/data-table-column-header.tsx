"use client";

import { ChevronDown, ChevronsUpDown, ChevronUp, X } from "lucide-react";
import { 
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, 
    DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { updateSearchParams } from "@/lib/params";

interface DataTableColumnHeaderProps {
    accessorKey: string;
    label: string;
}

export default function DataTableColumnHader({accessorKey, label}: DataTableColumnHeaderProps) {
    const router = useRouter();

    const handleSetAsc = () => {
        updateSearchParams(router, {sortField: accessorKey, sortOrder: "asc"}, {resetPage: true});
    }

    const handleSetDesc = () => {
        updateSearchParams(router, {sortField: accessorKey, sortOrder: "desc"}, {resetPage: true});
    }

    const handleReset = () => {
        updateSearchParams(router, {sortField: null, sortOrder: null}, {resetPage: true});
    }

    const searchParams = useSearchParams();
    const sortField = searchParams.get("sortField");
    const sortOrder = searchParams.get("sortOrder");

    const isChecked = (order?: string | null) => {
        return sortField === accessorKey && order === sortOrder;
    }

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="px-0!" variant="ghost">
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
                    <DropdownMenuCheckboxItem checked={isChecked("asc")} onClick={handleSetAsc}>
                        <ChevronUp className="w-4 h-4"/>
                        Asc
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={isChecked("desc")} onClick={handleSetDesc}>
                        <ChevronDown className="w-4 h-4"/>
                        Desc
                    </DropdownMenuCheckboxItem>
                    {sortField === accessorKey && sortOrder ? (
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