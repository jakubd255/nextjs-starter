"use server";

import { sendVerificationToken } from "@/lib/auth/email";
import { findEmailById } from "@/lib/db/queries/emails";
import { createToken } from "@/lib/db/queries/tokens";
import { actionFailure, actionSuccess } from "@/lib/types/action-result";

export default async function resendVerificationTokenAction(_: unknown, data: FormData) {
    const emailId = data.get("emailId") as string;

    const email = await findEmailById(emailId);
    if(!email) {
        return actionFailure({});
    }

    const token = await createToken(email.id);
    await sendVerificationToken(email.email, token.code);

    return actionSuccess();
}