import { eq } from "drizzle-orm"
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