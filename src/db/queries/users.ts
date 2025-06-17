import { and, eq, count, or, ilike, exists } from "drizzle-orm";
import db from "..";
import { generateIdFromEntropySize } from "lucia";
import { Role, User } from "@/lib/types";
import { users } from "../schema/users";
import { hashPassword } from "@/lib/auth/password";
import { emails } from "../schema";
import { PAGE_SIZE } from "@/lib/constants";

export const createUser = async (name: string, rawPassord: string, role: Role = "USER") => {
    const id = generateIdFromEntropySize(10);
    const password = hashPassword(rawPassord);
    
    const [res] = await db
        .insert(users)
        .values({id, name, password, role})
        .returning();

    return res;
}

export const findUserById = async (id: string) => {
    return await db.query.users.findFirst({
        where: eq(users.id, id)
    });
}

const buildUserSearchWhere = (search?: string) => {
    if(!search) return undefined;

    return or(
        ilike(users.name, `%${search}%`),
        ilike(users.id, `%${search}%`),
        ilike(users.role, `%${search}%`),
        ilike(users.bio, `%${search}%`),
        exists(
            db
                .select()
                .from(emails)
                .where(
                    and(
                        eq(emails.userId, users.id),
                        ilike(emails.email, `%${search}%`)
                    )
                )
        )
    );
}

export const getUsers = async (search: string, page: number = 1) => {
    const where = buildUserSearchWhere(search);

    return await db.query.users.findMany({
        with: {emails: true},
        where: where,
        limit: PAGE_SIZE,
        offset: (page-1)*PAGE_SIZE,
    });
}

export const countUsers = async (search: string) => {
    const where = buildUserSearchWhere(search);

    const result = await db
        .select({count: count()})
        .from(users)
        .where(where);

    return Number(result[0].count);
}

export const countByRole = async (role: Role) => {
    const res = await db
        .select({count: count()})
        .from(users)
        .where(eq(users.role, role));

    return res.at(0)!.count;
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