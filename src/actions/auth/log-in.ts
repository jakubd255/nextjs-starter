"use server";

import { createEmailVerificationToken } from "@/db/queries/tokens";
import { getUserByEmail } from "@/db/queries/users";
import { actionFailure } from "@/lib/action-result";
import { createSessionCookie } from "@/lib/auth";
import { validatePassword } from "@/lib/auth/password";
import { getDeviceInfo } from "@/lib/auth/device-info";
import { sendVerificationToken } from "@/lib/email";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validation/auth";

export default async function logInAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = loginSchema.safeParse(formData);

    if(!validationResult.success) {
        return actionFailure(validationResult.error.flatten().fieldErrors);
    }

    const {email, password, redirectTo} = validationResult.data;

    const user = await getUserByEmail(email);
    if(!user) {
        return actionFailure({email: ["Invalid email"]}, {email});
    }

    if(!user.password || !validatePassword(password, user.password)) {
        return actionFailure({password: ["Invalid password"]}, {email});
    }

    if(user.blocked) {
        return actionFailure({email: ["Invalid email"]}, {email});
    }

    if(user.verified) {
        const {os, browser} = await getDeviceInfo();
        await createSessionCookie(user.id, os, browser);
        redirect(redirectTo ?? "/");
    }
    else {
        const token = await createEmailVerificationToken(user.id);
        sendVerificationToken(email, token.code);
        redirect(`/auth/verify-email?userId=${user.id}`);
    }
}