"use server";

import { deleteUserById, getUserById } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { validateRequest } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function deleteUserAction(id: string, redirectToAdmin: boolean = false) {    
    const session = await validateRequest();
    if(!hasPermission(session.user, "user:delete")) {
        return actionFailure({permission: ["You dont have permission to delete users"]});
    }
    
    const user = await getUserById(id);
    if(!user) {
        return actionFailure();
    }

    await deleteUserById(id);

    if(redirectToAdmin) {
        redirect("/admin/users");
    }
    
    revalidatePath(`/admin/users/${id}`);
    revalidatePath("/admin/users");

    return actionSuccess();
}