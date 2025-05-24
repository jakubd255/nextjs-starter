"use server";

import { validateRequest } from "@/lib/auth";
import { deleteEmail } from "@/db/queries/emails";
import { actionFailure, actionSuccess } from "@/lib/action-result";

export default async function deleteEmailAction(emailId: string) {
    const {user} = await validateRequest();
    if(!user) {
        return actionFailure();
    }

    const result = await deleteEmail(emailId, user.id);
    if(!result) {
        return actionFailure();
    }

    return actionSuccess();
}