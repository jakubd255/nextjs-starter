"use server";

import { createSessionCookie } from "@/lib/auth";
import { findEmailByIdAndUser, setEmailVerified } from "@/lib/db/email";
import { getToken } from "@/lib/db/token";
import { setUserEmailVerified } from "@/lib/db/user";
import { verifyEmailSchema } from "@/lib/form-schema";
import { redirect } from "next/navigation";

export default async function verifyEmailAction(_: unknown, data: FormData) {
    const validationResult = verifyEmailSchema.safeParse(
        Object.fromEntries(data.entries())
    );
    if(!validationResult.success) {
        return {errors: validationResult.error?.flatten().fieldErrors};
    }

    try {
        const {emailId, code} = validationResult.data;

        const email = await findEmailByIdAndUser(emailId);
        if(!email) {
            throw Error("User not found");
        }

        const token = await getToken(emailId, code);
        if(!token) {
            return {errors: {code: ["Invalid verification code"]}};
        }

        await setEmailVerified(emailId);
        await setUserEmailVerified(email.userId);
        await createSessionCookie(email.user.id);
    }
    catch(error) {
        console.error(error);
        return {errors: {}};
    }

    redirect("/");
}