"use server";

import { deleteUserById, getUserById } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/utils/action-result";
import { validateRequest } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logUserDeleted } from "@/db/queries/audit-logs";

export default async function deleteUserAction(id: string, redirectToAdmin: boolean = false) {    
    const session = await validateRequest();
    if(!hasPermission(session.user, "user:delete")) {
        return actionFailure().message("You dont have permission to delete users").build();
    }
    
    const user = await getUserById(id);
    if(!user) {
        return actionFailure().build();
    }

    await logUserDeleted(session.user!.id, user.id);

    await deleteUserById(id);

    if(redirectToAdmin) {
        redirect("/admin/users");
    }
    
    revalidatePath("/admin/users");

    return actionSuccess().build();
}