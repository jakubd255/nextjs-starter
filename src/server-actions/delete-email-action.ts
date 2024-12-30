"use server";

import { validateRequest } from "@/lib/auth/lucia";
import { deleteEmail } from "@/lib/db/email";
import { emailIdSchema } from "@/lib/form-schema";

export default async function deleteEmailAction(emailId: string) {
    const validationResult = emailIdSchema.safeParse({emailId});
    if(!validationResult.success) {
        return {errors: validationResult.error?.flatten().fieldErrors};
    }

    const {user} = await validateRequest();
    if(!user) {
        return {errors: {}};
    }

    const result = await deleteEmail(user.id, emailId);
    if(!result) {
        return {errors: {}};
    }

    return {success: true};
}