"use server";

import { sendVerificationToken } from "@/lib/auth/email";
import { findEmailById } from "@/db/queries/emails";
import { createEmailToken } from "@/db/queries/tokens";
import { actionFailure, actionSuccess } from "@/lib/action-result";

export default async function resendVerificationTokenAction(_: unknown, data: FormData) {
    const emailId = data.get("emailId") as string;

    const email = await findEmailById(emailId);
    if(!email) {
        return actionFailure({});
    }

    const token = await createEmailToken(email.id);
    await sendVerificationToken(email.email, token.code);

    return actionSuccess();
}