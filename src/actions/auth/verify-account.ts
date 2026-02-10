"use server";

import { getTokenByCode } from "@/db/queries/tokens";
import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure } from "@/lib/action-result";
import { createSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import z from "zod";

const schema = z.object({
    userId: z.string(),
    code: z.string().length(8),
    os: z.string(),
    browser: z.string().optional().nullable()
});

export default async function verifyEmailAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = schema.safeParse(formData);

    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const {userId, code, os, browser} = validationResult.data;

    const user = await getUserById(userId);
    if(!user) {
        return actionFailure({});
    }

    const token = await getTokenByCode(code);
    if(!token || token.userId !== userId || token.expiresAt < new Date()) {
        return actionFailure({code: ["Invalid verification code"]});
    }

    await updateUser(userId, {verified: true});
    await createSessionCookie(userId, os, browser);

    redirect("/");
}