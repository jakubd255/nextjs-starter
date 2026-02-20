"use client";

import { FormEvent, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useTableQuery from "@/lib/hooks/use-table-query";

export default function DataTableSearch() {
    const {search} = useTableQuery();
    const [filter, setFilter] = useState(search.value);

    useEffect(() => {
        setFilter(search.value);
    }, [search.value]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        search.set(filter);
    }

    return(
        <form className="flex gap-2 max-w-75" onSubmit={handleSubmit}>
            <Input 
                placeholder="Search..." 
                value={filter} 
                onChange={e => setFilter(e.target.value)}
            />
            <Button variant="outline">
                Search
            </Button>
        </form>
    );
}