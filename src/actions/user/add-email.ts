"use server";

import { validateRequest } from "@/lib/auth";
import { isEmailtaken, upsertEmail } from "@/db/queries/emails";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { z } from "zod";

const schema = z.object({
    email: z.string().email()
});

export default async function addEmailAction(_: unknown, data: FormData) {
    const validationResult = schema.safeParse(
        Object.fromEntries(data.entries())
    );
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const {user} = await validateRequest();
    if(!user) {
        return actionFailure();
    }

    const {email} = validationResult.data;
    const isEmailTaken = await isEmailtaken(email);
    if(isEmailTaken) {
        return actionFailure({email: ["This email is taken"]});
    }

    const result = await upsertEmail(user.id, email, false);
    return actionSuccess({email: result});
}