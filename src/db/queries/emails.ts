import { generateIdFromEntropySize } from "lucia";
import db from "..";
import { and, eq } from "drizzle-orm";
import { emails } from "../schema/emails";
import { users } from "../schema/users";

export const isEmailtaken = async (email: string) => {
    return await db.query.emails.findFirst({
        where: and(
            eq(emails.email, email), 
            eq(emails.verified, true)
        )
    });
}

export const upsertEmail = async (userId: string, email: string, primary: boolean) => {
    const id = generateIdFromEntropySize(10);

    const [res] = await db
        .insert(emails)
        .values({id, email, userId, primary})
        .onConflictDoUpdate({
            target: emails.email,
            set: {userId, primary},
            setWhere: eq(emails.verified, false)
        })
        .returning();

    return res;
}

export const findEmail = async (email: string) => {
    return await db.query.emails.findFirst({
        where: eq(emails.email, email),
        with: {user: true}
    });
}

export const findEmailById = async (id: string) => {
    return await db.query.emails.findFirst({
        where: eq(emails.id, id),
        with: {user: true}
    });
}

export const findEmailsByUserId = async (userId: string) => {
    return await db.query.emails.findMany({
        where: eq(emails.userId, userId),
        with: {user: true}
    });
}

export const verifyUserEmail = async (emailId: string, userId: string) => {
    await db
        .update(emails)
        .set({verified: true})
        .where(and(
            eq(emails.id, emailId),
            eq(emails.userId, userId)
        ));
}

export const setEmailPrimary = async (emailId: string, userId: string) => {
    const res = await db.query.emails.findFirst({
        where: and(
            eq(emails.id, emailId),
            eq(emails.verified, true),
            eq(emails.primary, false)
        )
    });

    if(!res) {
        return false;
    }

    await db
        .update(emails)
        .set({primary: false})
        .where(eq(emails.userId, userId));

    await db
        .update(emails)
        .set({primary: true})
        .where(eq(emails.id, emailId));

    return true;
}

export const deleteEmail = async (emailId: string, userId: string) => {
    const [email] = await db
        .delete(emails)
        .where(and(
            eq(emails.id, emailId),
            eq(emails.userId, userId),
            eq(emails.primary, false)
        ))
        .returning();
    
    return email;
}