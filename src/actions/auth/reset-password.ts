"use server";

import { findPasswordToken } from "@/db/queries/tokens";
import { updateUser } from "@/db/queries/users";
import { actionFailure } from "@/lib/action-result";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
    password: z.string().min(8),
    code: z.string()
});

export default async function resetPasswordAction(_: unknown, data: FormData) {
    const validationResult = schema.safeParse(Object.fromEntries(data.entries()));
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const {password, code} = validationResult.data;

    const token = await findPasswordToken(code);
    console.log(token);
    if(!token || !token.user) {
        return actionFailure({password: ["Invalid token"]});
    }

    const {user} = token;

    await updateUser(user.id, {password});

    redirect("/auth/log-in");
}