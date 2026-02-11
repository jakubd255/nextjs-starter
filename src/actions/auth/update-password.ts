"use server";

import { validateRequest } from "@/lib/auth";
import { validatePassword } from "@/lib/auth/password";
import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { z } from "zod";

const schema = z.object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8)
})
.refine(data => {
    return data.newPassword === data.confirmNewPassword
}, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"]
});

export default async function updatePasswordAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = schema.safeParse(formData);
    
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const session = await validateRequest();
    if(!session.user) {
        return actionFailure({});
    }

    const {currentPassword, newPassword} = validationResult.data;

    const user = await getUserById(session.user.id);
    if(!user || !user.password) {
        return actionFailure({});
    }

    if(!validatePassword(currentPassword, user.password)) {
        return  actionFailure({currentPassword: ["Invalid password"]});
    }

    await updateUser(user.id, {password: newPassword});

    return actionSuccess();
}
