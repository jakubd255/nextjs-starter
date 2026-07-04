"use server";

import { getSessionById } from "@/db/queries/sessions";
import { actionFailure, actionSuccess } from "@/lib/utils/action-result";
import { terminateSession, validateRequest } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import lucia from "@/lib/auth/lucia";
import { logForceLogout } from "@/db/queries/audit-logs";
import { revalidatePath } from "next/cache";

export default async function deleteSessionAction(id: string) {
    const {user, session: currentSession} = await validateRequest();
    if(!user) {
        return actionFailure().build();
    }

    const session = await getSessionById(id);
    if(!session) {
        return actionFailure().build();
    }

    if(user.id !== session.userId || !hasPermission(user, "session:terminate")) {
        return actionFailure().message("You dont have permission to terminate this session").build();
    }

    if(session.id === currentSession.id) {
        terminateSession(session.id);
        redirect("/auth/log-in");
    }

    if(session.userId !== user.id) {
        await logForceLogout(user.id, session.userId);
    }

    lucia.invalidateSession(session.id);

    revalidatePath("/settings/sessions");

    return actionSuccess().build();
}