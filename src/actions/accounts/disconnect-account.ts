"use server";

import { deleteOAuthAccountById, getOAuthAccountById } from "@/db/queries/accounts";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { hasPermission } from "@/lib/auth/permissions";
import { validateRequest } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function disconnectOAuthAccountAction(id: string, redirectToSettings: boolean = false) {
    const {user} = await validateRequest();
    if(!user) {
        return actionFailure();
    }

    const account = await getOAuthAccountById(id);
    if(!account) {
        return actionFailure();
    }

    if(account.userId !== user.id || !hasPermission(user, "oauth:disconnect")) {
        return actionFailure({permission: ["You dont have permission to disconnect this account"]});
    }

    await deleteOAuthAccountById(id);

    if(redirectToSettings) {
        redirect("/settings/connected-accounts");
    }

    revalidatePath("/admin/accounts");

    return actionSuccess();
}