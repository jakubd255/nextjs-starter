import { generateIdFromEntropySize } from "lucia";
import db from ".."
import { providers } from "../schema"
import { and, count, eq } from "drizzle-orm";
import { Provider } from "@/lib/types";
import { PAGE_SIZE } from "@/lib/constants";
import { buildProviderSearchWhere, getOrderBy, GetProviderParams, ProviderFilters } from "../filters/providers";

export const createOAuthProvider = async (userId: string, provider: string, providerUserId: string, providerUsername: string): Promise<Provider> => {
    const id = generateIdFromEntropySize(10);
    
    const [res] = await db
        .insert(providers)
        .values({id, userId, provider, providerUserId, providerUsername})
        .onConflictDoNothing()
        .returning();
    return res;
}

export const getOAuthProviderById = async (id: string): Promise<Provider | undefined> => {
    return await db.query.providers.findFirst({
        where: eq(providers.id, id),
        with: {user: true}
    });
}

export const getUserByOAuthProvider = async (provider: string, providerUserId: string): Promise<Provider | undefined> => {
    return await db.query.providers.findFirst({
        where: and(
            eq(providers.provider, provider),
            eq(providers.providerUserId, providerUserId)
        ),
        with: {user: true}
    });
}

export const getOAuthProvidersByUserId = async (userId: string): Promise<Provider[]> => {
    return await db.query.providers.findMany({
        where: eq(providers.userId, userId)
    });
}

export const deleteOAuthProviderById = async (id: string) => {
    const res = await db
        .delete(providers)
        .where(eq(providers.id, id))
        .returning();
    return !!res.length;
}

export const getOAuthProvidersAdmin = async ({
    page = 1,
    pageSize = PAGE_SIZE,
    search,
    userId,
    provider,
    providerUserId,
    sortField = "createdAt",
    sortOrder = "asc"
}: GetProviderParams): Promise<Provider[]> => {
    const where = buildProviderSearchWhere({search, userId, provider, providerUserId});

    return await db.query.providers.findMany({
        where: where,
        with: {user: true},
        limit: pageSize,
        offset: (page-1)*pageSize,
        orderBy: getOrderBy(sortField, sortOrder),
    });
}

export const countOAuthProvidersAdmin = async (filters: ProviderFilters) => {
    const where = buildProviderSearchWhere(filters);

    const [result] = await db
        .select({count: count()})
        .from(providers)
        .where(where);

    return result.count;
}