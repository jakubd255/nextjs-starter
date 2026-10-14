"use server";

import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/utils/action-result";
import { validateRequest } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import { syncFiles } from "@/lib/upload/sync-files";
import { definePolicy, FILE_POLICIES } from "@/lib/upload/policy";

export default async function updateAvatarAction(_: unknown, data: FormData) {
    const id = data.get("id") as string;
    if(!id) return actionFailure().build();

    const [session, user] = await Promise.all([validateRequest(), getUserById(id)]);
    if(!session.user || !user) return actionFailure().build();

    if(user.id !== session.user.id && !hasPermission(session.user, "user:update:profile")) {
        return actionFailure().message("You don't have permission to update user's profile").build();
    }

    const result = await syncFiles({
        data,
        policy: definePolicy(FILE_POLICIES.images, {maxFiles: 1}),
        current: user.profileImage ? [{url: user.profileImage, name: ""}] : [],
        persist: (files) => updateUser(id, {profileImage: files[0]?.url ?? null}),
        scope: user.id
    });

    if(!result.ok) return actionFailure().message(result.message).build();

    revalidatePath("/");
    return actionSuccess().data({images: result}).build();
}