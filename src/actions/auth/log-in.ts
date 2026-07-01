"use server";

import { createEmailVerificationToken } from "@/db/queries/tokens";
import { getUserByEmail } from "@/db/queries/users";
import { actionFailure } from "@/lib/utils/action-result";
import { createSessionCookie } from "@/lib/auth/session";
import { validatePassword } from "@/lib/auth/password";
import { sendVerificationToken } from "@/lib/email";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validation/auth";
import { logLogInFailed, logLogInSuccess } from "@/db/queries/audit-logs";

export default async function logInAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = loginSchema.safeParse(formData);

    if(!validationResult.success) {
        return actionFailure(validationResult.error.flatten().fieldErrors);
    }

    const {email, password, redirectTo} = validationResult.data;

    const user = await getUserByEmail(email);
    if(!user) {
        await logLogInFailed(null, email);
        return actionFailure({email: ["Invalid email"]}, {email});
    }

    if(!user.password || !validatePassword(password, user.password)) {
        await logLogInFailed(null, email);
        return actionFailure({password: ["Invalid password"]}, {email});
    }

    if(user.blocked) {
        await logLogInFailed(null, email);
        return actionFailure({email: ["Invalid email"]}, {email});
    }

    if(user.verified) {
        await createSessionCookie(user.id);
        await logLogInSuccess(user.id);
        redirect(redirectTo ?? "/");
    }
    else {
        const token = await createEmailVerificationToken(user.id);
        sendVerificationToken(email, token.code);
        redirect(`/auth/verify-email?userId=${user.id}`);
    }
}