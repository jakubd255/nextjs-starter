import { and, eq, count } from "drizzle-orm";
import db from "..";
import { generateIdFromEntropySize } from "lucia";
import { Role, User } from "@/types";
import { users } from "../schema/users";
import { hashPassword } from "@/lib/auth/password";

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