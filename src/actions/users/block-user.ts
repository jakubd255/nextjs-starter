"use server";

import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { validateRequest } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

export default async function blockUserAction(id: string) {
    const session = await validateRequest();
    if(!hasPermission(session.user, "user:update:security")) {
        return actionFailure({permission: ["You dont have permission to block and unlock users"]});
    }

    const user = await getUserById(id);
    if(!user) {
        return actionFailure();
    }

    await updateUser(id, {blocked: !user.blocked});

    revalidatePath(`/admin/users/${id}`);
    revalidatePath("/admin/users");

    return actionSuccess({blocked: !user.blocked});
}