"use server";

import { getSessionById } from "@/db/queries/sessions";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import lucia, { validateRequest } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function deleteSessionAction(id: string) {
    const {user, session: currentSession} = await validateRequest();
    if(!user) {
        return actionFailure();
    }

    const session = await getSessionById(id);
    if(!session) {
        return actionFailure();
    }

    if(user.id !== session.userId && !hasPermission(user, "session:terminate")) {
        return actionFailure();
    }

    lucia.invalidateSession(session.id);

    if(session.id === currentSession.id) {
        const sessionCookie = lucia.createBlankSessionCookie();
	    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        redirect("/auth/log-in");
    }

    return actionSuccess();
}