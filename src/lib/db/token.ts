import prisma from ".";
import { VERIFICATION_TOKEN_LIFE_TIME } from "../constants";

export const generateRandomCode = (length = 6) => {
    const characters = "0123456789";
    let result = "";
    const charactersLength = characters.length;

    for(let i=0; i<length; i++) {
        result += characters.charAt(Math.floor(Math.random()*charactersLength));
    }

    return result;
}

export const createToken = async (emailId: string) => {
    return await prisma.verificationToken.create({
        data: {
            emailId: emailId,
            expiresAt: VERIFICATION_TOKEN_LIFE_TIME,
            code: generateRandomCode()
        }
    });
}

export const getToken = async (emailId: string, code: string) => {
    return await prisma.verificationToken.findFirst({
        where: {
            emailId: emailId,
            code: code
        }
    });
}

export const deleteTokensByUserId = async (emailId: string) => {
    return await prisma.verificationToken.deleteMany({
        where: {emailId}
    });
}