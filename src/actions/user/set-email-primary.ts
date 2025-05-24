"use server";

import { validateRequest } from "@/lib/auth";
import { setEmailPrimary } from "@/db/queries/emails";
import { actionFailure, actionSuccess } from "@/lib/action-result";

export default async function setEmailPrimaryAction(emailId: string) {
    const {user} = await validateRequest();
    if(!user) {
        return actionFailure();
    }

    const res = await setEmailPrimary(emailId, user.id);
    if(!res) {
        return actionFailure();
    }

    return actionSuccess();
}