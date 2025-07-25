"use server";

import { validatePassword } from "@/lib/auth/password";
import { redirect } from "next/navigation";
import { createSessionCookie } from "@/lib/auth";
import { findEmail } from "@/db/queries/emails";
import { actionFailure } from "@/lib/action-result";
import { z } from "zod";

const schema = z.object({
    email: z.string().email(), 
    password: z.string().min(8),
    os: z.string(),
    browser: z.string().optional().nullable(),
    redirectTo: z.string().optional().nullable()
});

export default async function logInAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = schema.safeParse(formData);

    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors, formData);
    }

    const {email, password, os, browser, redirectTo} = validationResult.data;

    const existingEmail = await findEmail(email);
    if(!existingEmail) {
        return actionFailure({email: ["Invalid email"]}, {email});
    }

    if(!validatePassword(password, existingEmail.user.password!)) {
        return actionFailure({password: ["Invalid password"]}, {email});
    }

    if(existingEmail.verified) {
        await createSessionCookie(existingEmail.user.id, os, browser);
        redirect(redirectTo ?? "/");
    }
    else {
        redirect(`/auth/verify-email?emailId=${existingEmail.id}`);
    }
}