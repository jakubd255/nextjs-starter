"use server";

import { logPasswordResetRequest } from "@/db/queries/audit-logs";
import { createResetPasswordToken } from "@/db/queries/tokens";
import { getUserByEmail } from "@/db/queries/users";
import { actionFailure } from "@/lib/utils/action-result";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
    email: z.email()
});

export default async function requestResetPasswordAction(_: unknown, data: FormData) {
    const validationResult = schema.safeParse(Object.fromEntries(data.entries()));
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors).build();
    }

    const {email} = validationResult.data;

    const user = await getUserByEmail(email);
    if(!user || !user.verified) {
        return actionFailure({email: ["Invalid email"]}).data({email}).build();
    }

    const token = await createResetPasswordToken(user.id);
    await logPasswordResetRequest(user.id);
    redirect(`/auth/forgot-password/${token.code}`);
}
