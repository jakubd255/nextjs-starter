"use server";

import { createSessionCookie } from "@/lib/auth";
import { findEmailById, verifyUserEmail } from "@/db/queries/emails";
import { findEmailToken } from "@/db/queries/tokens";
import { actionFailure } from "@/lib/action-result";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
    emailId: z.string(),
    code: z.string().length(6),
    os: z.string(),
    browser: z.string().optional().nullable()
});

export default async function verifyEmailAction(_: unknown, data: FormData) {
    const validationResult = schema.safeParse(
        Object.fromEntries(data.entries())
    );
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    try {
        const {emailId, code, os, browser} = validationResult.data;

        const email = await findEmailById(emailId);
        if(!email) {
            return actionFailure({});
        }

        const token = await findEmailToken(emailId, code);
        if(!token || token.expiresAt < new Date()) {
            return actionFailure({code: ["Invalid verification code"]});
        }

        await verifyUserEmail(emailId, email.userId);
        await createSessionCookie(email.user.id, os, browser);
    }
    catch(error) {
        console.error(error);
        return actionFailure({});
    }

    redirect("/");
}