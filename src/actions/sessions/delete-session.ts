"use server";

import { getSessionById } from "@/db/queries/sessions";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import lucia, { terminateSession, validateRequest } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
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

    if(user.id !== session.userId || !hasPermission(user, "session:terminate")) {
        return actionFailure({permission: ["You dont have permission to terminate this session"]});
    }

    if(session.id === currentSession.id) {
        terminateSession(session.id);
        redirect("/auth/log-in");
    }

    lucia.invalidateSession(session.id);
    return actionSuccess();
}