"use server";

import { deleteUserById, getUserById } from "@/db/queries/users";
import { actionFailure } from "@/lib/utils/action-result";
import { terminateSession, validateRequest } from "@/lib/auth/session";
import { validatePassword } from "@/lib/auth/password";
import { passwordSchema } from "@/lib/validation/auth";
import { redirect } from "next/navigation";
import { logUserDeleted } from "@/db/queries/audit-logs";
import { parseFormData } from "@/lib/utils/form-data-parser";

export default async function deleteAccountAction(_: unknown, data: FormData) {
    const validationResult = parseFormData(passwordSchema, data);
    if(!validationResult.success) {
        return actionFailure(validationResult.errors).build();
    }

    const session = await validateRequest();
    if(!session.user) {
        return actionFailure().build();
    }
    
    const user = await getUserById(session.user.id);
    if(!user) {
        return actionFailure().build();
    }

    if(!user.password) {
        return actionFailure({password: ["Password is not set yet"]}).build();
    }

    const {password} = validationResult.data;

    if(!validatePassword(password, user.password)) {
        return actionFailure({password: ["Invalid password"]}).build();
    }

    await logUserDeleted(session.user!.id, user.id);

    deleteUserById(user.id);

    terminateSession(session.session.id);

	redirect("/auth/log-in");
}