import { Lucia } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";
import { User } from "../types";
import { adapter } from "@/db";

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: User;
	}
}

const lucia = new Lucia(adapter, {
    sessionCookie: {
		expires: false,
		attributes: {
			sameSite: "lax",
        	path: "/",
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes(databaseUserAttributes) {
		return {
			id: databaseUserAttributes.id,
			name: databaseUserAttributes.name,
            email: databaseUserAttributes.email,
            pendingEmail: databaseUserAttributes.pendingEmail,
            verified: databaseUserAttributes.verified,
			profileImage: databaseUserAttributes.profileImage,
			bio: databaseUserAttributes.bio,
			hasPassword: !!databaseUserAttributes.password,
			role: databaseUserAttributes.role,
            blocked: databaseUserAttributes.blocked,
			createdAt: databaseUserAttributes.createdAt
		}
	},
});
export default lucia;

export const validateRequest = cache(async () => {
	const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;

	if(!sessionId) {
		return {user: null, session: null};
	}

	const result = await lucia.validateSession(sessionId);

	try {
		if(result.session && result.session.fresh) {
			const sessionCookie = lucia.createSessionCookie(result.session.id);
			(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
		if(!result.session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
	}
	catch {}

	return result;
});

export const createSessionCookie = async (userId: string, os: string, browser?: string | null) => {
	const session = await lucia.createSession(userId, {os, browser});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

export const terminateSession = async (id: string) => {
	lucia.invalidateSession(id);
	const sessionCookie = lucia.createBlankSessionCookie();
	(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}