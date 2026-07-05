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
import { parseFormData } from "@/lib/utils/form-data-parser";

export default async function logInAction(_: unknown, data: FormData) {
    const validationResult = parseFormData(loginSchema, data);
    if(!validationResult.success) {
        return actionFailure(validationResult.errors).build();
    }

    const {email, password, redirectTo} = validationResult.data;

    const user = await getUserByEmail(email);
    if(!user) {
        await logLogInFailed(null, email);
        return actionFailure({email: ["Invalid email"]}).data({email}).build();
    }

    if(!user.password || !validatePassword(password, user.password)) {
        await logLogInFailed(null, email);
        return actionFailure({password: ["Invalid password"]}).data({email}).build();
    }

    if(user.blocked) {
        await logLogInFailed(null, email);
        return actionFailure({email: ["Invalid email"]}).data({email}).build();
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