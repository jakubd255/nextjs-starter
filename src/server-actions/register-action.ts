"use server";

import { sendVerificationToken } from "@/lib/auth";
import { createToken } from "@/lib/db/token";
import { registerSchema } from "@/lib/form-schema";
import { redirect } from "next/navigation";
import { createUser } from "@/lib/db/user";
import { findVerifiedEmailAndUser, upsertEmail } from "@/lib/db/email";

export default async function registerAction(_: unknown, data: FormData) {
    const validationResult = registerSchema.safeParse(
        Object.fromEntries(data.entries())
    );
    if(!validationResult.success) {
        return {errors: validationResult.error?.flatten().fieldErrors};
    }

    const {name, email, password} = validationResult.data;

    const existingEmail = await findVerifiedEmailAndUser(email);
    if(existingEmail) {
        return {errors: {email: ["This email is taken"]}};
    }

    const user = await createUser(name, null, password);
    const userEmail = await upsertEmail(email, user.id);

    const token = await createToken(userEmail.id);
    await sendVerificationToken(userEmail.email, token);
    
    redirect(`verify-email?emailId=${userEmail.id}`);
}