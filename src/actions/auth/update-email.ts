"use server";

import { logEmailChange } from "@/db/queries/audit-logs";
import { createEmailVerificationToken } from "@/db/queries/tokens";
import { getUserByEmail, updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/utils/action-result";
import { validateRequest } from "@/lib/auth/session";
import { sendVerificationToken } from "@/lib/email";
import { updateEmailSchema } from "@/lib/validation/auth";
import { revalidatePath } from "next/cache";
import { parseFormData } from "@/lib/utils/form-data-parser";

export default async function updateEmailAction(_: unknown, data: FormData) {
    const validationResult = parseFormData(updateEmailSchema, data);
    if(!validationResult.success) {
        return actionFailure(validationResult.errors).build();
    }

    const {user} = await validateRequest();
    if(!user) {
        return actionFailure().build();
    }

    const {email} = validationResult.data;

    const existingUser = await getUserByEmail(email);
    if(existingUser?.verified && existingUser.id !== user.id) {
        return actionFailure({email: ["This email is taken"]}).build();
    }

    if(existingUser?.id === user.id && existingUser.verified) {
        updateUser(user.id, {email, pendingEmail: null});
    }
    else {
        await updateUser(user.id, {pendingEmail: email});
        const token = await createEmailVerificationToken(user.id);
        sendVerificationToken(email, token.code);
    }

    await logEmailChange(user.id, user.email, email);

    revalidatePath("/");

    return actionSuccess().build();
}