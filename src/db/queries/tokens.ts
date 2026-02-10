import { generateIdFromEntropySize } from "lucia";
import db from "..";
import { tokens } from "../schema";
import { TokenType } from "@/lib/types";
import { eq } from "drizzle-orm";

export const createToken = async (userId: string, type: TokenType) => {
    const id = generateIdFromEntropySize(10);
    const code = generateIdFromEntropySize(5);
    const expiresAt = new Date(Date.now()+1000*60*60);
    
    const [res] = await db
        .insert(tokens)
        .values({id, userId, expiresAt, code, type})
        .returning();
    return res;
}

export const createEmailVerificationToken = async (userId: string) => {
    return createToken(userId, "EMAIL_VERIFICATION");
}

export const getTokenByCode = async (code: string) => {
    return await db.query.tokens.findFirst({
        where: eq(tokens.code, code)
    });
}