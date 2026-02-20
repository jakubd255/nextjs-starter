"use client";

import { Button } from "../ui/button";
import { 
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, 
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import useTableQuery from "@/lib/hooks/use-table-query";

interface DataTableFilterProps {
    accessorKey: string;
    label: string;
    data: {
        value: string,
        label: string
    }[];
}

export default function DataTableFilterMulti({accessorKey, label, data}: DataTableFilterProps) {
    const {filter} = useTableQuery();

    const selected = filter.getAll(accessorKey);
    const [tempSelected, setTempSelected] = useState(selected);

    useEffect(() => {
        setTempSelected(selected);
    }, [selected.join(",")]);

    const handleClear = () => {
        setTempSelected([]);
        filter.clear(accessorKey);
    }

    const toggleChecked = (value: string) => {
        setTempSelected((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
    };

    const handleApply = () => {
        filter.set(accessorKey, tempSelected.length ? tempSelected : null);
    };
    
    return(
        <DropdownMenu onOpenChange={() => setTempSelected(selected)}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <span>
                        {label}
                    </span>
                    {selected.length >= 3 ? (
                        <>
                            <Separator orientation="vertical"/>
                            <small>
                                {selected.length} selected
                            </small>
                        </>
                    ) : selected.length > 0 ? (
                        <>
                            <Separator orientation="vertical"/>
                            {selected.map((item, index) => (
                                <small key={index}>
                                    {data.find(i => i.value === item)?.label}
                                </small>
                            ))}
                        </>
                    ) : (
                        <ChevronDown className="w-4 h-4 opacity-50"/>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {data.map(item => (
                    <DropdownMenuCheckboxItem 
                        key={item.value}
                        checked={tempSelected.includes(item.value)} 
                        onClick={(e) => {
                            e.preventDefault();
                            toggleChecked(item.value);
                        }}
                    >
                        {item.label}
                    </DropdownMenuCheckboxItem>
                ))}
                {tempSelected.length > 0 ? (
                    <>
                        <DropdownMenuSeparator/>
                        {tempSelected.length !== selected.length ? (
                            <DropdownMenuItem onClick={handleApply}>
                                Confirm
                            </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem onClick={handleClear}>
                            Clear filter
                        </DropdownMenuItem>
                    </>
                ) : null}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}