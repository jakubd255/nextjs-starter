"use server";

import { validateRequest } from "@/lib/auth/lucia";
import { updateUserPassword } from "@/lib/db/user";
import { addPasswordSchema } from "@/lib/form-schema";

export default async function addPasswordAction(_: unknown, data: FormData) {
    const validationResult = addPasswordSchema.safeParse(
        Object.fromEntries(data.entries())
    );
    if(!validationResult.success) {
        return {errors: validationResult.error?.flatten().fieldErrors};
    }

    const {user} = await validateRequest();
    if(!user) {
        return {errors: {}};
    }

    const {password} = validationResult.data;
    await updateUserPassword(user.id, password);

    return {success: true};
}