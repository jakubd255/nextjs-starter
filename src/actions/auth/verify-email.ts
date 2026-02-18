"use server";

import { getTokenByCode } from "@/db/queries/tokens";
import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure } from "@/lib/action-result";
import { createSessionCookie } from "@/lib/auth";
import { getDeviceInfo } from "@/lib/auth/device-info";
import { redirect } from "next/navigation";
import z from "zod";

const schema = z.object({
    userId: z.string(),
    code: z.string().length(8)
});

export default async function verifyEmailAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = schema.safeParse(formData);

    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const {userId, code} = validationResult.data;

    const user = await getUserById(userId);
    if(!user) {
        return actionFailure({});
    }

    const token = await getTokenByCode(code);
    if(!token || token.userId !== userId || token.expiresAt < new Date()) {
        return actionFailure({code: ["Invalid verification code"]});
    }

    if(!user.verified) {
        const {os, browser} = await getDeviceInfo();
        await updateUser(userId, {verified: true});
        await createSessionCookie(userId, os, browser);
    }
    else if(user.pendingEmail) {
        await updateUser(user.id, {email: user.pendingEmail, pendingEmail: null});
    }

    redirect("/");
}