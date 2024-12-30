"use server";

import { validateRequest } from "@/lib/auth/lucia";
import { validatePassword } from "@/lib/auth/password";
import { getUserById, updateUserPassword } from "@/lib/db/user";
import { updatePasswordSchema } from "@/lib/form-schema";

export default async function updatePasswordAction(_: unknown, data: FormData) {
    const validationResult = updatePasswordSchema.safeParse(
        Object.fromEntries(data.entries())
    );
    if(!validationResult.success) {
        return {errors: validationResult.error?.flatten().fieldErrors};
    }

    const request = await validateRequest();
    if(!request.user) {
        return {errors: {}};
    }

    const {currentPassword, newPassword} = validationResult.data;

    const user = await getUserById(request.user.id);
    if(!validatePassword(currentPassword, user?.hashedPassword!)) {
        return {errors: {currentPassword: ["Invalid password"]}};
    }

    await updateUserPassword(request.user.id, newPassword);

    return {success: true};
}