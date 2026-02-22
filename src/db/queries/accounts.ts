import { generateIdFromEntropySize } from "lucia";
import db from ".."
import { accounts } from "../schema"
import { and, count, eq } from "drizzle-orm";
import { OAuthAccount, OAuthProvider } from "@/lib/types";
import { PAGE_SIZE } from "@/lib/constants";
import { AccountFilters, buildAccountSearchWhere, GetAccountParams, getOrderBy } from "../filters/accounts";

export const createOAuthAccount = async (userId: string, provider: OAuthProvider, providerUserId: string, providerUsername: string): Promise<OAuthAccount> => {
    const id = generateIdFromEntropySize(10);
    
    const [res] = await db
        .insert(accounts)
        .values({id, userId, provider, providerUserId, providerUsername})
        .onConflictDoNothing()
        .returning();
    return res;
}

export const getOAuthAccountById = async (id: string): Promise<OAuthAccount | undefined> => {
    return await db.query.accounts.findFirst({
        where: eq(accounts.id, id),
        with: {user: true}
    });
}

export const getUserByOAuthAccount = async (provider: OAuthProvider, providerUserId: string): Promise<OAuthAccount | undefined> => {
    return await db.query.accounts.findFirst({
        where: and(
            eq(accounts.provider, provider),
            eq(accounts.providerUserId, providerUserId)
        ),
        with: {user: true}
    });
}

export const getOAuthAccountsByUserId = async (userId: string): Promise<OAuthAccount[]> => {
    return await db.query.accounts.findMany({
        where: eq(accounts.userId, userId)
    });
}

export const deleteOAuthAccountById = async (id: string) => {
    const res = await db
        .delete(accounts)
        .where(eq(accounts.id, id))
        .returning();
    return !!res.length;
}

export const getOAuthAccountsAdmin = async ({
    page = 1,
    pageSize = PAGE_SIZE,
    search,
    userId,
    provider,
    providerUserId,
    sortField = "createdAt",
    sortOrder = "asc"
}: GetAccountParams): Promise<OAuthAccount[]> => {
    const where = buildAccountSearchWhere({search, userId, provider, providerUserId});

    return await db.query.accounts.findMany({
        where: where,
        with: {user: true},
        limit: pageSize,
        offset: (page-1)*pageSize,
        orderBy: getOrderBy(sortField, sortOrder),
    });
}

export const countOAuthAccountsAdmin = async (filters: AccountFilters) => {
    const where = buildAccountSearchWhere(filters);

    const [result] = await db
        .select({count: count()})
        .from(accounts)
        .where(where);

    return result.count;
}