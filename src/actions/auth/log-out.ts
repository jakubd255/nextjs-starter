"use server";

import lucia, { validateRequest } from "@/lib/auth";
import { actionFailure } from "@/lib/action-result";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function logOutAction() {
    const {session} = await validateRequest();
	if(!session) {
		return actionFailure({});
	}

	lucia.invalidateSession(session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	redirect("/auth/log-in");
}