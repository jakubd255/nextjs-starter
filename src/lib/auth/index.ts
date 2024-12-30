import { cookies } from "next/headers";
import { VerificationToken } from "@prisma/client";
import { createSession } from "../db/session";
import lucia from "./lucia";

export const createSessionCookie = async (userId: string) => {
	const session = await createSession(userId);

	const sessionCookie = lucia.createSessionCookie(session.id);
	(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

export const sendVerificationToken = async (email: string, token: VerificationToken) => {
	//To be implemented
	//For now console log
	console.log(email, token.code);
}