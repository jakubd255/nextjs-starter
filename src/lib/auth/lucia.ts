import { Lucia } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";
import { adapter } from "../db";

interface DatabaseUserAttributes {
	id: string;
	name: string;
	profileImage: string | undefined;
	bio: string | undefined;
	verifiedEmail: boolean;
	hashedPassword: string;
}

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
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
			profileImage: databaseUserAttributes.profileImage,
			bio: databaseUserAttributes.bio,
			verifiedEmail: databaseUserAttributes.verifiedEmail,
			hasPassword: (databaseUserAttributes.hashedPassword ? true : false)
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