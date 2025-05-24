"use server";

import { sendVerificationToken } from "@/lib/auth/email";
import { isEmailtaken, upsertEmail } from "@/db/queries/emails";
import { createEmailToken } from "@/db/queries/tokens";
import { createUser } from "@/db/queries/users";
import { actionFailure } from "@/lib/action-result";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
    name: z.string().min(2).max(32),
    email: z.string().email(), 
    password: z.string().min(8)
});

export default async function registerAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = schema.safeParse(formData);
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
    const token = await createEmailToken(userEmail.id);

    sendVerificationToken(email, token.code);

    redirect(`/auth/verify-email?emailId=${userEmail.id}`);
}