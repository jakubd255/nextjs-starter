import { and, eq, ne} from "drizzle-orm"
import db from ".."
import { sessions } from "../schema"

export const getSessionsByUserId = async (userId: string) => {
    return await db.query.sessions.findMany({
        where: eq(sessions.userId, userId)
    });
}

export const getSessionById = async (id: string) => {
    return await db.query.sessions.findFirst({
        where: eq(sessions.id, id)
    });
}

export const deleteSessionsByUserId = async (userId: string, excludedId?: string) => {
    await db
        .delete(sessions)
        .where(and(
            eq(sessions.userId, userId),
            excludedId ? ne(sessions.id, excludedId) : undefined
        ));
}