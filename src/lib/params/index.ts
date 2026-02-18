import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type UpdateParamsOptions = {
    resetPage?: boolean;
    clearOthers?: boolean;
};

export const updateSearchParams = (
    router: AppRouterInstance,
    updates: Record<string, string | string[] | number | boolean | null | undefined>,
    options?: UpdateParamsOptions
) => {
    const params = options?.clearOthers ? new URLSearchParams() : new URLSearchParams(window.location.search);

    Object.entries(updates).forEach(([key, value]) => {
        if(value === null || value === undefined || value === "") {
            params.delete(key);
        } 
        else if(Array.isArray(value)) {
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