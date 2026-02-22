import { cache } from "react";
import { cookies, headers } from "next/headers";
import { Permission } from "../types";
import { hasPermission } from "./permissions";
import { redirect } from "next/navigation";
import { UAParser } from "ua-parser-js";
import lucia from "./lucia";

export const validateRequest = cache(async () => {
	const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;

	if(!sessionId) {
		return {user: null, session: null};
	}

	try {
		const result = await lucia.validateSession(sessionId);

		if(result.session && result.session.fresh) {
			const sessionCookie = lucia.createSessionCookie(result.session.id);
			(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
		if(!result.session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}

		if(result.user?.blocked) {
			return {user: null, session: null};
		}

		return result;
	}
	catch {
		return {user: null, session: null};
	}
});

const getDeviceInfo = async () => {
	const userAgent = (await headers()).get("user-agent") ?? "";
	const parser = new UAParser(userAgent);
	const {os, browser} = parser.getResult();

	return {
		os: String(os.name), 
		browser: browser.name
	}
}

export const createSessionCookie = async (userId: string) => {
	const {os, browser} = await getDeviceInfo();
	const session = await lucia.createSession(userId, {os, browser});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

export const terminateSession = async (id: string) => {
	lucia.invalidateSession(id);
	const sessionCookie = lucia.createBlankSessionCookie();
	(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

export const requireAuth = async (permission?: Permission) => {
	const {user, session} = await validateRequest();

	if(!user || !session) {
		return redirect("/auth/log-in");
	}

	if(permission && !hasPermission(user, permission)) {
		return redirect("/forbidden");
	}

	return {user, session};
}