"use server";

import { createResetPasswordToken } from "@/db/queries/tokens";
import { getUserByEmail } from "@/db/queries/users";
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

    const user = await getUserByEmail(email);
    if(!user || !user.verified) {
        return actionFailure({email: ["Invalid email"]}, {email});
    }

    const token = await createResetPasswordToken(user.id);

    redirect(`/auth/forgot-password/${token.code}`);
}
