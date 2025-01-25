"use server";

import { sendVerificationToken } from "@/lib/auth/email";
import { isEmailtaken, upsertEmail } from "@/lib/db/queries/emails";
import { createToken } from "@/lib/db/queries/tokens";
import { createUser } from "@/lib/db/queries/users";
import { actionFailure } from "@/lib/types/action-result";
import { registerSchema } from "@/lib/validation";
import { redirect } from "next/navigation";

export default async function registerAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = registerSchema.safeParse(formData);
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors, formData);
    }

    const {name, email, password} = validationResult.data;

    const isEmailTaken = await isEmailtaken(email);
    if(isEmailTaken) {
        return actionFailure({email: ["This email is taken"]}, {email, name});
    }

    const user = await createUser(name, password);
    const userEmail = await upsertEmail(user.id, email, true);
    const token = await createToken(userEmail.id);

    sendVerificationToken(email, token.code);

    redirect(`/auth/verify-email?emailId=${userEmail.id}`);
}