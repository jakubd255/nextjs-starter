"use server";

import { validateRequest } from "@/lib/auth";
import { isEmailtaken, upsertEmail } from "@/lib/db/queries/emails";
import { actionFailure, actionSuccess } from "@/lib/types/action-result";
import { addEmailSchema } from "@/lib/validation";

export default async function addEmailAction(_: unknown, data: FormData) {
    const validationResult = addEmailSchema.safeParse(
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