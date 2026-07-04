"use server";

import { validateRequest } from "@/lib/auth/session";
import { validatePassword } from "@/lib/auth/password";
import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/utils/action-result";
import { updatePasswordSchema } from "@/lib/validation/auth";
import { logPasswordResetRequest } from "@/db/queries/audit-logs";

export default async function updatePasswordAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = updatePasswordSchema.safeParse(formData);
    
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors).build();
    }

    const session = await validateRequest();
    if(!session.user) {
        return actionFailure().build();
    }

    const {currentPassword, newPassword} = validationResult.data;

    const user = await getUserById(session.user.id);
    if(!user || !user.password) {
        return actionFailure().build();
    }

    if(!validatePassword(currentPassword, user.password)) {
        return  actionFailure({currentPassword: ["Invalid password"]}).build();
    }

    await updateUser(user.id, {password: newPassword});
    await logPasswordResetRequest(user.id);

    return actionSuccess().build();
}
