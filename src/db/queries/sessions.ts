import { and, eq, ne} from "drizzle-orm"
import db from ".."
import { sessions } from "../schema"
import { Session } from "@/lib/types";

export const getSessionsByUserId = async (userId: string): Promise<Session[]> => {
    return await db.query.sessions.findMany({
        where: eq(sessions.userId, userId)
    });
}

export const getSessionById = async (id: string): Promise<Session | undefined> => {
    return await db.query.sessions.findFirst({
        where: eq(sessions.id, id)
    });
}

export const deleteSessionsByUserId = async (userId: string, excludedId?: string) => {
    const res = await db
        .delete(sessions)
        .where(and(
            eq(sessions.userId, userId),
            excludedId ? ne(sessions.id, excludedId) : undefined
        )).returning;
    return !!res.length;
}