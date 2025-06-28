"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SearchProps {
    search?: string;
}

export default function DataSearch({search}: SearchProps) {
    const [filter, setFilter] = useState(search ?? "");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());

        if(!filter) {
            params.delete("search");
        }
        else {
            params.set("search", filter);
        }

        router.replace(`${pathname}?${params.toString()}`);
    }

    return(
        <div className="flex gap-2 max-w-[300px]">
            <Input 
                placeholder="Search..." 
                value={filter} 
                onChange={e => setFilter(e.target.value)}
            />
            <Button variant="outline" onClick={handleSearch}>
                Search
            </Button>
        </div>
    );
}