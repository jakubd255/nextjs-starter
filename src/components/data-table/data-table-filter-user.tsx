"use client";

import { User } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import useTableQuery from "@/lib/hooks/use-table-query";

interface DataTableFilterUserProps {
    user?: User;
}

export default function DataTableFilterUser({user}: DataTableFilterUserProps) {
    const { filter } = useTableQuery();

    const handleClear = () => {
        filter.clear("userId");
    }
    
    if(!user) return null;

    return(
        <>
            <Separator orientation="vertical"/>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        {user.name} ({user.role})
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleClear}>
                        Clear filter
                    </DropdownMenuItem> 
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}