import { and, eq, count } from "drizzle-orm";
import db from "..";
import { generateIdFromEntropySize } from "lucia";
import { User } from "@/types";
import { users } from "../schema/users";
import { hashPassword } from "@/lib/auth/password";

export const createUser = async (name: string, rawPassord: string) => {
    const id = generateIdFromEntropySize(10);
    const password = hashPassword(rawPassord);
    
    const [res] = await db
        .insert(users)
        .values({id, name, password})
        .returning();

    return res;
}

export const findUserById = async (id: string) => {
    return await db.query.users.findFirst({
        where: eq(users.id, id)
    });
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

/*export const initAdmin = async () => {
    const admin = await db.query.users.findFirst({
        where: eq(users.role, "admin")
    });

    if(!admin) {
        const id = generateIdFromEntropySize(10);
        const password = hashPassword(process.env.ADMIN_PASSWORD!);

        await db
            .insert(users)
            .values({id, password, name: "admin"});
    }
}*/