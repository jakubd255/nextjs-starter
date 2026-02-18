"use server";

import { createEmailVerificationToken } from "@/db/queries/tokens";
import { getUserByEmail, updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { validateRequest } from "@/lib/auth";
import { sendVerificationToken } from "@/lib/email";
import { updateEmailSchema } from "@/lib/validation/auth";

export default async function updateEmailAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = updateEmailSchema.safeParse(formData);
    
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const session = await validateRequest();
    if(!session.user) {
        return actionFailure();
    }

    const {email} = validationResult.data;

    const user = await getUserByEmail(email);
   
    if(user?.id === session.user.id && user.verified) {
        updateUser(session.user.id, {email, pendingEmail: null});
        return actionSuccess({email, cancel: true});
    }

    if(user?.verified) {
        return actionFailure({email: ["This email is taken"]});
    }

    await updateUser(session.user.id, {pendingEmail: email});

    const token = await createEmailVerificationToken(session.user.id);
    sendVerificationToken(email, token.code);

    return actionSuccess({email});
}