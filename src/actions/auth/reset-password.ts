"use server";

import { logPasswordResetSuccess } from "@/db/queries/audit-logs";
import { deleteSessionsByUserId } from "@/db/queries/sessions";
import { getTokenByCode } from "@/db/queries/tokens";
import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure } from "@/lib/utils/action-result";
import { resetPasswordSchema } from "@/lib/validation/auth";
import { redirect } from "next/navigation";

export default async function resetPasswordAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = resetPasswordSchema.safeParse(formData);
    
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors).build();
    }

    const {code, newPassword} = validationResult.data;

    const token = await getTokenByCode(code);
    if(!token) {
        return actionFailure().build();
    }

    const user = await getUserById(token.userId);
    if(!user || !user.verified) {
        return actionFailure().build();
    }

    await updateUser(token.userId, {password: newPassword});
    await deleteSessionsByUserId(token.userId);
    await logPasswordResetSuccess(user.id);

    redirect("/auth/log-in");
}