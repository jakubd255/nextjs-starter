"use server";

import { validateRequest } from "@/lib/auth";
import { validatePassword } from "@/lib/auth/password";
import { findUserById, updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { z } from "zod";

const schema = z.object({
    newPassword: z.string().min(8),
    currentPassword: z.string().min(8)
});

export default async function updatePasswordAction(_: unknown, data: FormData) {
    const validationResult = schema.safeParse(
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