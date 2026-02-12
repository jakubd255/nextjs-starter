"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { updateSearchParams } from "@/lib/params";

interface DataTableFilterSingleProps {
    accessorKey: string;
    label: string;
    data: {
        value: string,
        label: string
    }[];
}

export default function DataTableFilterSingle({accessorKey, label, data}: DataTableFilterSingleProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selected = searchParams.get(accessorKey);

    const toggleChecked = (value: string) => {
        updateSearchParams(router, {[accessorKey]: selected === value ? null : value}, {resetPage: true});
    }

    const handleClear = () => {
        updateSearchParams(router, {[accessorKey]: null}, {resetPage: true});
    }

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <span>
                        {label}
                    </span>
                    {selected ? (
                        <>
                            <Separator orientation="vertical"/>
                            <small>
                                {data.find(i => i.value === selected)?.label}
                            </small>
                        </>
                    ): null}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {data.map(item => (
                    <DropdownMenuCheckboxItem 
                        checked={item.value === selected} 
                        onClick={() => toggleChecked(item.value)}
                        key={item.value}
                    >
                        {item.label}
                    </DropdownMenuCheckboxItem>
                ))}
                {selected ? (
                    <>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={handleClear}>
                            Clear filter
                        </DropdownMenuItem> 
                    </>
                ): null}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}