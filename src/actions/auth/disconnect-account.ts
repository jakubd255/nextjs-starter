"use server";

import { deleteOAuthAccountById, getOAuthAccountById, getOAuthAccountsByUserId } from "@/db/queries/accounts";
import { actionFailure } from "@/lib/action-result";
import { validateRequest } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function disconnectOAuthAccountAction(id: string) {
    const {user} = await validateRequest();
    if(!user) {
        return actionFailure();
    }

    const providers = await getOAuthAccountsByUserId(user.id);
    if(providers.length <= 1 && !user.hasPassword) {
        return actionFailure({message: ["You can't disconnect account if it's only one or you don't have password set"]});
    }

    const provider = await getOAuthAccountById(id);
    if(!provider || provider.userId !== user.id) {
        return actionFailure();
    }

    await deleteOAuthAccountById(id);

    redirect("/settings/connected-accounts");
}