import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
import { providers } from "../schema";

export interface ProviderFilters {
    search?: string;
    userId?: string;
    provider?: string;
    providerUserId?: string;
}

export interface GetProviderParams {
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    search?: string;
    userId?: string;
    provider?: string;
    providerUserId?: string;
};

export const buildProviderSearchWhere = (filters: ProviderFilters) => {
    const conditions = [];

    if(filters.search) {
        conditions.push(
            or(
                ilike(providers.id, `%${filters.search}%`),
                ilike(providers.userId, `%${filters.search}%`),
                ilike(providers.provider, `%${filters.search}%`),
                ilike(providers.providerUserId, `%${filters.search}%`)
            )
        );
    }

    if(filters.userId) {
        conditions.push(eq(providers.userId, filters.userId));
    }
    if(filters.provider) {
        conditions.push(eq(providers.provider, filters.provider));
    }
    if(filters.providerUserId) {
        conditions.push(eq(providers.providerUserId, filters.providerUserId));
    }
    if(conditions.length === 0) return undefined;

    return and(...conditions);
}

export const getOrderBy = (field: string = "createdAt", order: string = "asc") => {
    const columnMap = {
        createdAt: providers.createdAt,
        userId: providers.userId,
        provider: providers.provider,
        providerUserId: providers.providerUserId,
        id: providers.id
    };

    const column = columnMap[field as keyof typeof columnMap];
    return order === "asc" ? asc(column) : desc(column);
}