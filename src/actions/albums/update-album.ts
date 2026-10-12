"use server";

import { getAlbumByUserId, upsertAlbumImages } from "@/db/queries/albums";
import { validateRequest } from "@/lib/auth/session";
import { syncImages } from "@/lib/storage/sync-images";
import { actionFailure, actionSuccess } from "@/lib/utils/action-result";
import { revalidatePath } from "next/cache";

export default async function updateAlbumAction(_: unknown, data: FormData) {
    const {user, session} = await validateRequest();
    if(!session || !user) return actionFailure().build();

    const album = await getAlbumByUserId(user.id);

    const result = await syncImages({
        data,
        current: album?.images ?? [],
        persist: (images) => upsertAlbumImages(user.id, images)
    });

    if(!result.ok) return actionFailure().message(result.message).build();

    revalidatePath("/");
    return actionSuccess().data({images: result.images}).build();
}