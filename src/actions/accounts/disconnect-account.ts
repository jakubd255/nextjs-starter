"use server";

import { deleteOAuthAccountById, getOAuthAccountById } from "@/db/queries/accounts";
import { actionFailure, actionSuccess } from "@/lib/utils/action-result";
import { hasPermission } from "@/lib/auth/permissions";
import { validateRequest } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function disconnectOAuthAccountAction(id: string, redirectToSettings: boolean = false) {
    const {user} = await validateRequest();
    if(!user) {
        return actionFailure().build();
    }

    const account = await getOAuthAccountById(id);
    if(!account) {
        return actionFailure().build();
    }

    if(account.userId !== user.id || !hasPermission(user, "oauth:disconnect")) {
        return actionFailure().message("You dont have permission to disconnect this account").build();
    }

    await deleteOAuthAccountById(id);

    if(redirectToSettings) {
        redirect("/settings/connected-accounts");
    }

    revalidatePath("/admin/accounts");

    return actionSuccess().build();
}