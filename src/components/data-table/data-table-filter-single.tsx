"use client";

import { Button } from "../ui/button";
import { 
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, 
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { ChevronDown } from "lucide-react";
import useTableQuery from "@/lib/hooks/use-table-query";

interface DataTableFilterSingleProps {
    accessorKey: string;
    label: string;
    data: {
        value: string,
        label: string
    }[];
}

export default function DataTableFilterSingle({accessorKey, label, data}: DataTableFilterSingleProps) {
    const { filter } = useTableQuery();
    const selected = filter.get(accessorKey);

    const toggleChecked = (value: string) => {
        filter.toggleSingle(accessorKey, value);
    }

    const handleClear = () => {
        filter.clear(accessorKey);
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
                    ) : (
                        <ChevronDown className="w-4 h-4 opacity-50"/>
                    )}
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
                ) : null}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}