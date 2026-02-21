"use server";

import { deleteOAuthProviderById, getOAuthProviderById, getOAuthProvidersByUserId } from "@/db/queries/providers";
import { actionFailure } from "@/lib/action-result";
import { validateRequest } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function disconnectProviderAction(id: string) {
    const {user} = await validateRequest();
    if(!user) {
        return actionFailure();
    }

    const provider = await getOAuthProviderById(id);
    if(!provider || provider.userId !== user.id) {
        return actionFailure();
    }

    const userProviders = await getOAuthProvidersByUserId(user.id);
    if(!user.hasPassword && userProviders.length <= 1) {
        return actionFailure();
    }

    await deleteOAuthProviderById(id);

    redirect("/settings/connections");
}