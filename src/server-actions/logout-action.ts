"use server";

import lucia, { validateRequest } from "@/lib/auth/lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function logoutAction() {
    const {session} = await validateRequest();
	if(!session) {
		return {error: "Unauthorized"};
	}

	lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	redirect("/auth/log-in");
}