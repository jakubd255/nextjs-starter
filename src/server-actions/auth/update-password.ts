"use server";

import { validateRequest } from "@/lib/auth";
import { validatePassword } from "@/lib/auth/password";
import { findUserById, updateUser } from "@/lib/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/types/action-result";
import { updatePasswordSchema } from "@/lib/validation";

export default async function updatePasswordAction(_: unknown, data: FormData) {
    const validationResult = updatePasswordSchema.safeParse(
        Object.fromEntries(data.entries())
    );
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const request = await validateRequest();
    if(!request.user) {
        return actionFailure({});
    }

    const {currentPassword, newPassword} = validationResult.data;

    const user = await findUserById(request.user.id);
    if(!user) {
        return actionFailure({});
    }


    if(!validatePassword(currentPassword, user.password)) {
        return {errors: {currentPassword: ["Invalid password"]}};
    }

    await updateUser(request.user.id, {password: newPassword});

    return actionSuccess();
}