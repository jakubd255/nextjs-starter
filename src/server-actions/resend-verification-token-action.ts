"use server";

import { sendVerificationToken } from "@/lib/auth";
import { findEmailById } from "@/lib/db/email";
import { createToken } from "@/lib/db/token";
import { emailIdSchema } from "@/lib/form-schema";

export default async function resentVerificationTokenAction(_: unknown, data: FormData) {
    const validationResult = emailIdSchema.safeParse(
        Object.fromEntries(data.entries())
    );
    if(!validationResult.success) {
        return {errors: validationResult.error?.flatten().fieldErrors};
    }

    const email = await findEmailById(validationResult.data.emailId);
    if(!email) {
        return {errors: {}};
    }

    const token = await createToken(email.id);
    await sendVerificationToken(email.email, token);

    return {success: true};
}