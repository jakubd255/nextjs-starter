import { Role } from "../types";

export interface UserSearchParams {
    page?: number;
    search?: string;
    role?: Role[];
    verified?: string;
    blocked?: string;
    sortField?: string;
    sortOrder?: string;
}

export const parseUserParams = (params: UserSearchParams) => {
    return {
        page: Number(params.page) || 1,
        search: params.search || undefined,
        role: Array.isArray(params.role) ? params.role : params.role ? [params.role] : undefined,
        verified: params.verified === undefined ? undefined : params.verified === "true",
        blocked: params.blocked === undefined ? undefined : params.blocked === "true",
        sortField: params.sortField as any,
        sortOrder: params.sortOrder as any,
    };
}