import { Lucia } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";
import { User } from "../../types";
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
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes(databaseUserAttributes) {
		return {
			id: databaseUserAttributes.id,
			name: databaseUserAttributes.name,
            verifiedEmail: databaseUserAttributes.verifiedEmail,
			profileImage: databaseUserAttributes.profileImage,
			bio: databaseUserAttributes.bio,
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

export const createSessionCookie = async (userId: string) => {
	const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}