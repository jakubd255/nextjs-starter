"use server";

import { loginSchema } from "@/lib/form-schema";
import { createSessionCookie } from "@/lib/auth";
import { validatePassword } from "@/lib/auth/password";
import { redirect } from "next/navigation";
import { findEmailAndUser } from "@/lib/db/email";

export default async function loginAction(_: unknown, data: FormData) {
    const validationResult = loginSchema.safeParse(
        Object.fromEntries(data.entries())
    );
    if(!validationResult.success) {
        return {errors: validationResult.error?.flatten().fieldErrors};
    }

    const {email, password} = validationResult.data;

    const existingEmail = await findEmailAndUser(email);
    if(!existingEmail) {
        return {errors: {email: ["Invalid email"]}}
    }    
    const {user} = existingEmail;

    if(!validatePassword(password, user.hashedPassword!)) {
        return {errors: {password: ["Invalid password"]}}
    }

    if(existingEmail.verified && existingEmail.user.verifiedEmail) {
        await createSessionCookie(user.id);
        redirect("/");
    }
    else {
        redirect(`verify-email?emailId=${existingEmail.id}`);
    }
}