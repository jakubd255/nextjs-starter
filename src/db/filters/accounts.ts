import { and, asc, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { accounts } from "../schema";
import { OAuthProvider } from "@/lib/types";

export interface AccountFilters {
    search?: string;
    userId?: string;
    provider?: OAuthProvider[];
    providerUserId?: string;
}

export interface GetAccountParams {
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    search?: string;
    userId?: string;
    provider?: OAuthProvider[];
    providerUserId?: string;
}

export const buildAccountSearchWhere = (filters: AccountFilters) => {
    const conditions = [];

    if(filters.search) {
        conditions.push(
            or(
                ilike(accounts.id, `%${filters.search}%`),
                ilike(accounts.userId, `%${filters.search}%`),
                ilike(accounts.provider, `%${filters.search}%`),
                ilike(accounts.providerUserId, `%${filters.search}%`)
            )
        );
    }

    if(filters.userId) {
        conditions.push(eq(accounts.userId, filters.userId));
    }
    if(filters.provider && filters.provider.length > 0) {
        conditions.push(inArray(accounts.provider, filters.provider));
    }
    if(filters.providerUserId) {
        conditions.push(eq(accounts.providerUserId, filters.providerUserId));
    }
    if(conditions.length === 0) return undefined;

    return and(...conditions);
}

export const getOrderBy = (field: string = "createdAt", order: string = "asc") => {
    const columnMap = {
        createdAt: accounts.createdAt,
        userId: accounts.userId,
        provider: accounts.provider,
        providerUserId: accounts.providerUserId,
        id: accounts.id
    };

    const column = columnMap[field as keyof typeof columnMap];
    return order === "asc" ? asc(column) : desc(column);
}