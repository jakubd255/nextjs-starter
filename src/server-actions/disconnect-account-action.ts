"use server";

import { validateRequest } from "@/lib/auth/lucia";
import { deleteOAuthAccount } from "@/lib/db/account";

export default async function disconnectAccountAction(_: unknown, data: FormData) {
    const provider = data.get("provider") as string;
    const providers = ["github"];

    if(!providers.includes(provider)) {
        return {success: false};
    }

    const {user} = await validateRequest();
    if(!user) {
        return {success: false};
    }

    await deleteOAuthAccount(user.id, provider);
    return {success: true};
}