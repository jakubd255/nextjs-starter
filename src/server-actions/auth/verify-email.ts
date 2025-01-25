"use server";

import { createSessionCookie } from "@/lib/auth";
import { findEmailById, verifyUserEmail } from "@/lib/db/queries/emails";
import { findToken } from "@/lib/db/queries/tokens";
import { actionFailure } from "@/lib/types/action-result";
import { verifyEmailSchema } from "@/lib/validation";
import { redirect } from "next/navigation";

export default async function verifyEmailAction(_: unknown, data: FormData) {
    const validationResult = verifyEmailSchema.safeParse(
        Object.fromEntries(data.entries())
    );
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    try {
        const {emailId, code} = validationResult.data;

        const email = await findEmailById(emailId);
        if(!email) {
            return actionFailure({});
        }

        const token = await findToken(emailId, code);
        if(!token || token.expiresAt < new Date()) {
            return actionFailure({code: ["Invalid verification code"]});
        }

        await verifyUserEmail(emailId, email.userId);
        await createSessionCookie(email.user.id);
    }
    catch(error) {
        console.error(error);
        return actionFailure({});
    }

    redirect("/");
}