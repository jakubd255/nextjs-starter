"use server";

import { createEmailVerificationToken } from "@/db/queries/tokens";
import { getUserById } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { validateRequest } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { sendVerificationToken } from "@/lib/email";

export default async function resendVerifyUserAction(id: string) {
    const session = await validateRequest();
    if(!hasPermission(session.user, "token:resend")) {
        return actionFailure({permission: ["You dont have permission to resend verification token"]});
    }

    const user = await getUserById(id);
    if(!user) {
        return actionFailure();
    }

    const token = await createEmailVerificationToken(id);

    if(!user.verified) {
        sendVerificationToken(user.email, token.code);
    }
    else if(user.pendingEmail) {
        sendVerificationToken(user.pendingEmail, token.code);
    }
    else {
        return actionFailure();
    }

    return actionSuccess();
}