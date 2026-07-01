"use server";

import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/utils/action-result";
import { validateRequest } from "@/lib/auth/session";
import { hasPermission, Role } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import { logRoleChange } from "@/db/queries/audit-logs";

export default async function updateRoleAction(id: string, role: Role) {
    const session = await validateRequest();
    if(!hasPermission(session.user, "user:update:role")) {
        return actionFailure({permission: ["You dont have permission to update role"]});
    }

    const user = await getUserById(id);
    if(!user) {
        return actionFailure();
    }

    await logRoleChange(session.user!.id, user.id, user.role, role);

    await updateUser(id, {role});

    revalidatePath("/admin/users");

    return actionSuccess({role});
}