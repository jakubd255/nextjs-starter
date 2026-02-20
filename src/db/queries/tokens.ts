import { generateIdFromEntropySize } from "lucia";
import db from "..";
import { tokens } from "../schema";
import { Token, TokenType } from "@/lib/types";
import { eq } from "drizzle-orm";

export const createToken = async (userId: string, type: TokenType): Promise<Token> => {
    const id = generateIdFromEntropySize(10);
    const code = generateIdFromEntropySize(5);
    const expiresAt = new Date(Date.now()+1000*60*60);
    
    const [res] = await db
        .insert(tokens)
        .values({id, userId, expiresAt, code, type})
        .returning();
    return res;
}

export const createEmailVerificationToken = async (userId: string): Promise<Token> => {
    return createToken(userId, "EMAIL_VERIFICATION");
}

export const createResetPasswordToken = async (userId: string): Promise<Token> => {
    return createToken(userId, "RESET_PASSWORD");
}

export const getTokenByCode = async (code: string): Promise<Token | undefined> => {
    return await db.query.tokens.findFirst({
        where: eq(tokens.code, code)
    });
}