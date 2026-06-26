import { users } from "../schema";
import { buildGenericWhere, createOrderBy } from "./generic";

const userSearchColumns = [users.id, users.name, users.role, users.bio, users.email, users.pendingEmail];

const userSortMap = {
    id: users.id,
    createdAt: users.createdAt,
    name: users.name,
    email: users.email,
    role: users.role,
};

export const buildUserSearchWhere = (filters: any) => buildGenericWhere(filters, {
    searchColumns: userSearchColumns,
    exactMatches: {verified: users.verified, blocked: users.blocked},
    arrayMatches: {role: users.role}
});

export const getUserOrderBy = (field?: string, order?: string) => createOrderBy(userSortMap, field, order);