import { accounts } from "../schema";
import { buildGenericWhere, createOrderBy } from "./generic";

const accountSearchColumns = [accounts.id, accounts.userId, accounts.provider, accounts.providerUserId];

const accountSortMap = {
    id: accounts.id,
    createdAt: accounts.createdAt,
    userId: accounts.userId,
    provider: accounts.provider,
    providerUserId: accounts.providerUserId,
};

export const buildAccountSearchWhere = (filters: any) => buildGenericWhere(filters, {
    searchColumns: accountSearchColumns,
    exactMatches: {userId: accounts.userId, providerUserId: accounts.providerUserId},
    arrayMatches: {provider: accounts.provider}
});

export const getAccountOrderBy = (field?: string, order?: string) => createOrderBy(accountSortMap, field, order);