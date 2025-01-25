"use server";

import { validatePassword } from "@/lib/auth/password";
import { redirect } from "next/navigation";
import { createSessionCookie } from "@/lib/auth";
import { findEmail } from "@/lib/db/queries/emails";
import { actionFailure } from "@/lib/types/action-result";
import { logInSchema } from "@/lib/validation";

export default async function logInAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = logInSchema.safeParse(formData);

    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors, formData);
    }

    const {email, password} = validationResult.data;

    const existingEmail = await findEmail(email);
    if(!existingEmail) {
        return actionFailure({email: ["Invalid email"]}, {email});
    }

    if(!validatePassword(password, existingEmail.user.password!)) {
        return actionFailure({password: ["Invalid password"]}, {email});
    }

    if(existingEmail.verified && existingEmail.user.verifiedEmail) {
        await createSessionCookie(existingEmail.user.id);
        redirect("/");
    }
    else {
        redirect(`/auth/verify-email?emailId=${existingEmail.id}`);
    }
}