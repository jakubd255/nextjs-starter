"use server";

import { logPasswordResetRequest } from "@/db/queries/audit-logs";
import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure } from "@/lib/utils/action-result";
import { validateRequest } from "@/lib/auth/session";
import { passwordSchema } from "@/lib/validation/auth";
import { redirect } from "next/navigation";
import { parseFormData } from "@/lib/utils/form-data-parser";

export default async function setPasswordAction(_: unknown, data: FormData) {
    const validationResult = parseFormData(passwordSchema, data);
    if(!validationResult.success) {
        return actionFailure(validationResult.errors).build();
    }

    const session = await validateRequest();
    if(!session.user) {
        return actionFailure().build();
    }
    
    const user = await getUserById(session.user.id);
    if(!user || user.password) {
        return actionFailure().build();
    }

    const {password} = validationResult.data;

    await updateUser(user.id, {password});
    await logPasswordResetRequest(user.id);

    redirect("/settings/account");
}