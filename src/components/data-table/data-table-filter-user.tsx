"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import useTableQuery from "@/lib/hooks/use-table-query";
import { User } from "@/db/schema/users";

interface Props {
    user?: User;
}

export default function DataTableFilterUser({user}: Props) {
    const { filter } = useTableQuery();

    const handleClear = () => {
        filter.clear("userId");
    }
    
    if(!user) return null;

    return(
        <>
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
            <Separator orientation="vertical"/>
        </>
    );
}