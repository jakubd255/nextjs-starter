"use server";

import { deleteSessionsByUserId } from "@/db/queries/sessions";
import { getTokenByCode } from "@/db/queries/tokens";
import { updateUser } from "@/db/queries/users";
import { actionFailure } from "@/lib/action-result";
import { resetPasswordSchema } from "@/lib/validation/auth";
import { redirect } from "next/navigation";

export default async function resetPasswordAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = resetPasswordSchema.safeParse(formData);
    
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const {code, newPassword} = validationResult.data;

    const token = await getTokenByCode(code);
    if(!token) {
        return actionFailure({});
    }

    await updateUser(token.userId, {password: newPassword});
    await deleteSessionsByUserId(token.userId);

    redirect("/auth/log-in");
}