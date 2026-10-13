"use server";

import { getAlbumByUserId, upsertAlbumImages } from "@/db/queries/albums";
import { validateRequest } from "@/lib/auth/session";
import { definePolicy, FILE_POLICIES } from "@/lib/upload/policy";
import { syncFiles } from "@/lib/upload/sync-files";
import { actionFailure, actionSuccess } from "@/lib/utils/action-result";
import { revalidatePath } from "next/cache";

export default async function updateAlbumAction(_: unknown, data: FormData) {
    const {user, session} = await validateRequest();
    if(!session || !user) return actionFailure().build();

    const album = await getAlbumByUserId(user.id);

    const result = await syncFiles({
        data,
        policy: definePolicy(FILE_POLICIES.images, {maxFiles: 10}),
        current: album?.files ?? [],
        persist: (files) => upsertAlbumImages(user.id, files)
    });

    if(!result.ok) return actionFailure().message(result.message).build();

    revalidatePath("/");
    return actionSuccess().data({files: result.files}).build();
}