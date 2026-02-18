"use server";

import { createEmailVerificationToken } from "@/db/queries/tokens";
import { createUser, getUserByEmail } from "@/db/queries/users";
import { actionFailure } from "@/lib/action-result";
import { sendVerificationToken } from "@/lib/email";
import { registerSchema } from "@/lib/validation/auth";
import { redirect } from "next/navigation";

export default async function registerAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = registerSchema.safeParse(formData);

    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors, formData);
    }

    const {name, email, password} = validationResult.data;

    const existingUser = await getUserByEmail(email);

    if(!existingUser) {
        const user = await createUser(name, email, password);
        const token = await createEmailVerificationToken(user.id);
        sendVerificationToken(email, token.code);
        redirect(`/auth/verify-email?userId=${user.id}`);
    }
    else if(!existingUser.verified) {
        const token = await createEmailVerificationToken(existingUser.id);
        sendVerificationToken(email, token.code);
        redirect(`/auth/verify-email?userId=${existingUser.id}`);
    }
    else {
        return actionFailure({email: ["This email is taken"]}, {email, name});
    }
}