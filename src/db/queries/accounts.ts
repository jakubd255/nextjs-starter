import { generateIdFromEntropySize } from "lucia";
import db from ".."
import { accounts } from "../schema"
import { and, count, eq } from "drizzle-orm";
import { OAuthAccount, OAuthProvider } from "@/lib/types";
import { buildAccountSearchWhere, getAccountOrderBy } from "../filters/accounts";
import { parseAccountsParams } from "@/app/(admin)/admin/accounts/params";
import { countTableRows } from "../filters/generic";

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

export const getOAuthAccountsAdmin = async (parsedParams: ReturnType<typeof parseAccountsParams>) => {
    const where = buildAccountSearchWhere(parsedParams);

    return await db.query.accounts.findMany({
        where: where,
        with: { user: true },
        limit: parsedParams.pageSize,
        offset: (parsedParams.page - 1) * parsedParams.pageSize,
        orderBy: getAccountOrderBy(parsedParams.sortField, parsedParams.sortOrder),
    });
};

export const countOAuthAccountsAdmin = async (filters: any) => {
    return countTableRows(db, accounts, buildAccountSearchWhere(filters));
};