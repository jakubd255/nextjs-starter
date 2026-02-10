import { hashPassword } from "@/lib/auth/password";
import { generateIdFromEntropySize } from "lucia";
import db from "..";
import { users } from "../schema";
import { Role, User } from "@/lib/types";
import { and, count, eq } from "drizzle-orm";

export const createUser = async (name: string, email: string, rawPassword: string, role: Role = "USER", verified = false) => {
    const id = generateIdFromEntropySize(10);
    const password = hashPassword(rawPassword);

    const [res] = await db
        .insert(users)
        .values({id, name, email, verified, password, role})
        .returning();
    return res;
}

export const countUsersByRole = async (role: Role) => {
    const res = await db.select({count: count()})
        .from(users)
        .where(eq(users.role, role));
    return res[0].count;
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
    return !!(await db.query.users.findFirst({
        where: and(
            eq(users.email, email),
            eq(users.verified, true)
        )
    }));
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