"use server";

import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/utils/action-result";
import { validateRequest } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import { syncImages } from "@/lib/storage/sync-images";

export default async function updateAvatarAction(_: unknown, data: FormData) {
    const id = data.get("id") as string;
    if(!id) return actionFailure().build();

    const [session, user] = await Promise.all([validateRequest(), getUserById(id)]);
    if(!session.user || !user) return actionFailure().build();

    if(user.id !== session.user.id && !hasPermission(session.user, "user:update:profile")) {
        return actionFailure().message("You don't have permission to update user's profile").build();
    }

    const result = await syncImages({
        data,
        maxFiles: 1,
        current: user.profileImage ? [user.profileImage] : [],
        persist: (images) => updateUser(id, {profileImage: images[0] ?? null})
    });

    if(!result.ok) return actionFailure().message(result.message).build();

    revalidatePath("/");
    return actionSuccess().data({images: result.images}).build();
}