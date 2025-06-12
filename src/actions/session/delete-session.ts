"use server";

import { getSessionById } from "@/db/queries/sessions";
import { actionFailure } from "@/lib/action-result";
import lucia, { validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function deleteSessionAction(id: string) {
    const {user, session} = await validateRequest();
    const deleteSession = await getSessionById(id);

    if(!user || !session || !deleteSession) {
        return actionFailure({});
    }

    if(deleteSession.userId !== user.id) {
        return actionFailure({});
    }

    if(deleteSession.id === session.id) {
        lucia.invalidateSession(session.id);
        const sessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        redirect("/auth/log-in");
    }
}