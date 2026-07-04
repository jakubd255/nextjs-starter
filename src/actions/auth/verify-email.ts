"use server";

import { getTokenByCode } from "@/db/queries/tokens";
import { getUserById, updateUser } from "@/db/queries/users";
import { createSessionCookie } from "@/lib/auth/session";
import { actionFailure } from "@/lib/utils/action-result";
import { verifyEmailSchema } from "@/lib/validation/auth";
import { redirect } from "next/navigation";

export default async function verifyEmailAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = verifyEmailSchema.safeParse(formData);

    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors).build();
    }

    const {userId, code} = validationResult.data;

    const user = await getUserById(userId);
    if(!user) {
        return actionFailure().build();
    }

    const token = await getTokenByCode(code);
    if(!token || token.userId !== userId || token.expiresAt < new Date()) {
        return actionFailure({code: ["Invalid verification code"]}).build();
    }

    if(!user.verified) {
        await updateUser(userId, {verified: true});
        await createSessionCookie(userId);
    }
    else if(user.pendingEmail) {
        await updateUser(user.id, {email: user.pendingEmail, pendingEmail: null});
    }

    redirect("/");
}