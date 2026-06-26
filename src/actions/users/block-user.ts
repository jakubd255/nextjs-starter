"use server";

import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { validateRequest } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import { logUserBlocked, logUserUnlocked } from "@/db/queries/audit-logs";

export default async function blockUserAction(id: string) {
    const session = await validateRequest();
    if(!hasPermission(session.user, "user:update:security")) {
        return actionFailure({permission: ["You dont have permission to block and unlock users"]});
    }

    const user = await getUserById(id);
    if(!user) {
        return actionFailure();
    }

    if(user.blocked) {
        await logUserUnlocked(session.user!.id, user.id);
    }
    else {
        await logUserBlocked(session.user!.id, user.id);
    }

    await updateUser(id, {blocked: !user.blocked});

    revalidatePath(`/admin/users/${id}`);
    revalidatePath("/admin/users");

    return actionSuccess({blocked: !user.blocked});
}