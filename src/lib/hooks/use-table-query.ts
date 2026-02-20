import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface UpdateOptions {
    resetPage?: boolean;
    clearOthers?: boolean;
};

export default function useTableQuery() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const paramsObject = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

    const update = (updates: Record<string, any>, options?: UpdateOptions) => {
        const params = options?.clearOthers ? new URLSearchParams() : new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if(value === null || value === undefined || value === "") {
                params.delete(key);
            }
            else if (Array.isArray(value)) {
                params.delete(key);
                value.forEach((v) => params.append(key, String(v)));
            }
            else {
                params.set(key, String(value));
            }
        });

        if(options?.resetPage) {
            params.delete("page");
        }

        router.push(`?${params.toString()}`);
    }

    const setSort = (field: string | null, order: "asc" | "desc" | null) => {
        update({
            sortField: order ? field : null, 
            sortOrder: order
        }, {
            resetPage: true
        });
    }

    const setSearch = (value: string) => {
        update({search: value}, {resetPage: true});
    }

    const setFilter = (key: string, value: string | string[] | null) => {
        update({[key]: value}, {resetPage: true});
    }

    const toggleSingle = (key: string, value: string) => {
        const current = searchParams.get(key);
        setFilter(key, current === value ? null : value);
    }

    const toggleMulti = (key: string, value: string) => {
        const current = searchParams.getAll(key);

        const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];

        update({[key]: next.length ? next : null}, {resetPage: true});
    }

    const clearFilter = (key: string) => {
        update({[key]: null}, {resetPage: true});
    }

    const clearAllFilters = () => {
        const sortField = searchParams.get("sortField");
        const sortOrder = searchParams.get("sortOrder");

        update({sortField, sortOrder}, {clearOthers: true, resetPage: true});
    }

    return {
        params: paramsObject,
        sort: {
            field: searchParams.get("sortField"),
            order: searchParams.get("sortOrder"),
            set: setSort
        },
        search: {
            value: searchParams.get("search") ?? "",
            set: setSearch
        },
        filter: {
            get: (key: string) => searchParams.get(key),
            getAll: (key: string) => searchParams.getAll(key),
            set: setFilter,
            toggleSingle,
            toggleMulti,
            clear: clearFilter,
            clearAll: clearAllFilters
        },
        pagination: {
            page: searchParams.get("page"),
            set: (page: number) => update({page}),
        }
    }
}