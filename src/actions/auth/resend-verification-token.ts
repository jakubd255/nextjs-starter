"use server";

import { createEmailVerificationToken } from "@/db/queries/tokens";
import { getUserById } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { sendVerificationToken } from "@/lib/email";

export default async function resendVerificationTokenAction(_: unknown, data: FormData) {
    const userId = data.get("userId") as string;

    const user = await getUserById(userId);
    if(!user) {
        return actionFailure({});
    }

    const token = await createEmailVerificationToken(userId);

    if(!user.verified) {
        await sendVerificationToken(user.email, token.code);
    }
    else if(user.pendingEmail) {
        await sendVerificationToken(user.pendingEmail, token.code);
    }
    else {
        return actionFailure();
    }

    return actionSuccess();
}