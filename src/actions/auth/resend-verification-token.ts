"use server";

import { createEmailVerificationToken, createToken } from "@/db/queries/tokens";
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
    await sendVerificationToken(user.email, token.code);

    return actionSuccess();
}