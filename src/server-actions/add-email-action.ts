"use server";

import { validateRequest } from "@/lib/auth/lucia";
import { findEmail } from "@/lib/db/email";
import { updateUserEmail } from "@/lib/db/user";
import { addEmailSchema } from "@/lib/form-schema";

export default async function addEmailAction(_: unknown, data: FormData) {
    const validationResult = addEmailSchema.safeParse(
        Object.fromEntries(data.entries())
    );
    if(!validationResult.success) {
        return {errors: validationResult.error?.flatten().fieldErrors};
    }

    const {user} = await validateRequest();
    if(!user) {
        return {errors: {}};
    }

    const {email} = validationResult.data;
    const existingEmail = await findEmail(email);
    if(existingEmail?.verified) {
        return {errors: {email: ["This email is taken"]}}
    }

    const result = await updateUserEmail(user.id, email);
    return {errors: {email: []}, result};
}