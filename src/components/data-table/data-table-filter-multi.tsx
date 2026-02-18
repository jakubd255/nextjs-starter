"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { 
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, 
    DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { updateSearchParams } from "@/lib/params";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface DataTableFilterProps {
    accessorKey: string;
    label: string;
    data: {
        value: string,
        label: string
    }[];
}

export default function DataTableFilterMulti({accessorKey, label, data}: DataTableFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selected = searchParams.getAll(accessorKey);
    const [tempSelected, setTempSelected] = useState(selected);

    const handleClear = () => {
        setTempSelected([]);
        updateSearchParams(router, {[accessorKey]: null}, {resetPage: true});
    }

    useEffect(() => {
        setTempSelected(selected);
    }, [selected.join(",")]);

    const toggleChecked = (value: string) => {
        setTempSelected((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
    };

    const handleApply = () => {
        updateSearchParams(router, {[accessorKey]: tempSelected.length ? tempSelected : null}, {resetPage: true});
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