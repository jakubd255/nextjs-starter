"use server";

import { logEmailChange } from "@/db/queries/audit-logs";
import { createEmailVerificationToken } from "@/db/queries/tokens";
import { getUserByEmail, updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/utils/action-result";
import { validateRequest } from "@/lib/auth/session";
import { sendVerificationToken } from "@/lib/email";
import { updateEmailSchema } from "@/lib/validation/auth";
import { revalidatePath } from "next/cache";

export default async function updateEmailAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = updateEmailSchema.safeParse(formData);
    
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const {user} = await validateRequest();
    if(!user) {
        return actionFailure();
    }

    const {email} = validationResult.data;

    const existingUser = await getUserByEmail(email);
    if(existingUser?.verified && existingUser.id !== user.id) {
        return actionFailure({email: ["This email is taken"]});
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

    return actionSuccess();
}