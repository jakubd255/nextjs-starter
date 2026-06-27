import { hashPassword } from "@/lib/auth/password";
import { generateIdFromEntropySize } from "lucia";
import db from "..";
import { users } from "../schema";
import { and, count, eq } from "drizzle-orm";
import { buildUserSearchWhere, getUserOrderBy } from "../filters/users";
import { parseUserParams } from "@/app/(admin)/admin/users/params";
import { countTableRows } from "../filters/generic";
import { Role } from "@/lib/auth/permissions";
import { User } from "../schema/users";

export const createUser = async (name: string, email: string, rawPassword?: string | null, role: Role = "USER", verified = false) => {
    const id = generateIdFromEntropySize(10);
    const password = rawPassword ? hashPassword(rawPassword) : null;

    const [res] = await db
        .insert(users)
        .values({id, name, email, verified, password, role})
        .returning();
    return res;
}

export const countUsersByRole = async (role: Role) => {
    const [res] = await db.select({count: count()})
        .from(users)
        .where(eq(users.role, role));
    return res.count;
}

export const getUserById = async (id: string) => {
    return await db.query.users.findFirst({
        where: eq(users.id, id)
    });
}

export const getUserByEmail = async (email: string) => {
    return await db.query.users.findFirst({
        where: eq(users.email, email)
    });
}

export const getIsUserEmailTaken = async (email: string) => {
    const res = await db.query.users.findFirst({
        where: and(
            eq(users.email, email),
            eq(users.verified, true)
        )
    });
    return !!res;
}

export const updateUser = async (id: string, data: Partial<User>) => {
    if(data.password) {
        data.password = hashPassword(data.password);
    }

    await db
        .update(users)
        .set(data)
        .where(eq(users.id, id));
}

export const deleteUserById = async (id: string) => {
    const res = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning();
    return !!res.length;
}

export const getUsersAdmin = async (parsedParams: ReturnType<typeof parseUserParams>) => {
    const where = buildUserSearchWhere(parsedParams);

    return await db.query.users.findMany({
        where: where,
        limit: parsedParams.pageSize,
        offset: (parsedParams.page - 1) * parsedParams.pageSize,
        orderBy: getUserOrderBy(parsedParams.sortField, parsedParams.sortOrder),
    });
}

export const countUsersAdmin = async (filters: any) => {
    return countTableRows(db, users, buildUserSearchWhere(filters));
}