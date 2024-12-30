"use server";

import { validateRequest } from "@/lib/auth/lucia";
import { setEmailPrimary } from "@/lib/db/email";
import { emailIdSchema } from "@/lib/form-schema";

export default async function setEmailPrimaryAction(emailId: string) {
    const validationResult = emailIdSchema.safeParse({emailId});
    if(!validationResult.success) {
        return {errors: validationResult.error?.flatten().fieldErrors};
    }

    const {user} = await validateRequest();
    if(!user) {
        return {errors: {}};
    }

    const email = await setEmailPrimary(user.id, emailId);
    if(!email) {
        return {errors: {}};
    }

    return {success: true};
}