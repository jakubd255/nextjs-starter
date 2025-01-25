import { generateIdFromEntropySize } from "lucia";
import db from "..";
import { and, eq } from "drizzle-orm";
import { tokens } from "../schema/tokens";

const generateRandomCode = (length = 6) => {
    const characters = "0123456789";
    let result = "";
    const charactersLength = characters.length;

    for(let i=0; i<length; i++) {
        result += characters.charAt(Math.floor(Math.random()*charactersLength));
    }

    return result;
}

export const createToken = async (emailId: string) => {
    const id = generateIdFromEntropySize(10);
    const code = generateRandomCode();
    const expiresAt = new Date(Date.now()+1000*60*60);
    
    const [res] = await db
        .insert(tokens)
        .values({id, emailId, expiresAt, code})
        .returning();

    return res;
}

export const findToken = async (emailId: string, code: string) => {
    return await db.query.tokens.findFirst({
        where: and(
            eq(tokens.code, code),
            eq(tokens.emailId, emailId)
        )
    });
}