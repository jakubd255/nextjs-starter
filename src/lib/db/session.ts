import prisma from ".";
import { SESSION_LIFE_TIME } from "../constants";

export const createSession = async (userId: string) => {
    return await prisma.session.create({
		data: {
			userId: userId,
			expiresAt: SESSION_LIFE_TIME,
		}
	});
}