"use server";

import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { validateRequest } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { Role } from "@/lib/types";
import { revalidatePath } from "next/cache";

export default async function updateRoleAction(_: unknown, data: FormData) {
    const id = data.get("id") as string;
    const role = data.get("role") as Role;

    const session = await validateRequest();
    if(!hasPermission(session.user, "user:update:role")) {
        return actionFailure({permission: ["You dont have permission to update role"]});
    }

    const user = await getUserById(id);
    if(!user) {
        return actionFailure();
    }

    await updateUser(id, {role});

    revalidatePath(`/admin/users/${id}`);
    revalidatePath("/admin/users");

    return actionSuccess({role});
}