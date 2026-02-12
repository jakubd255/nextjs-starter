"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { updateSearchParams } from "@/lib/params";

export default function DataTableSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get("search") ?? "";
    const [filter, setFilter] = useState(search);

    const handleSearch = () => {
        updateSearchParams(router, {search: filter}, {resetPage: true});
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSearch();
    }

    useEffect(() => {
        setFilter(search);
    }, [searchParams, search]);

    return(
        <form className="flex gap-2 max-w-75" onSubmit={handleSubmit}>
            <Input 
                placeholder="Search..." 
                value={filter} 
                onChange={e => setFilter(e.target.value)}
            />
            <Button variant="outline" onClick={handleSearch}>
                Search
            </Button>
        </form>
    );
}