"use server";

import { deleteSessionsByUserId } from "@/db/queries/sessions";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { validateRequest } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";

export default async function deleteUserSessionsAction(id: string) {
    const {user, session} = await validateRequest();
    if(!session || !hasPermission(user, "session:terminate")) {
        return actionFailure({permission: ["You dont have permission to terminate sessions"]});
    }

    await deleteSessionsByUserId(id, session.id);

    return actionSuccess();
}