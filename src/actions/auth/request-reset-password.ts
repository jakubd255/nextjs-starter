"use server";

import { sendResetPasswordToken } from "@/lib/auth/password";
import { findEmail } from "@/db/queries/emails";
import { createPasswordToken } from "@/db/queries/tokens";
import { actionFailure } from "@/lib/action-result";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
    email: z.string().email()
});

export default async function requestResetPasswordAction(_: unknown, data: FormData) {
    const validationResult = schema.safeParse(Object.fromEntries(data.entries()));
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const {email} = validationResult.data;

    const userEmail = await findEmail(email);
    if(!userEmail || !userEmail.verified) {
        return actionFailure({email: ["Invalid email"]}, {email});
    }

    const token = await createPasswordToken(userEmail.userId);
    await sendResetPasswordToken(email, token.code);

    redirect(`/auth/reset-password/${token.code}`);
}