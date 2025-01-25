"use server";

import { validateRequest } from "@/lib/auth";
import { updateUser } from "@/lib/db/queries/users";
import { deleteFile, isLocalFile, uploadFile } from "@/lib/file-handler";
import { actionFailure, actionSuccess } from "@/lib/types/action-result";

export default async function updateProfileImageAction(_: unknown, data: FormData) {
    const image = data.get("image") as File | null;
    if(!image) {
        return actionFailure();
    }

    const {user} = await validateRequest();
    if(!user) {
        return actionFailure();
    }

    const fileName = await uploadFile(image);
    if(user.profileImage && isLocalFile(user.profileImage)) {
        deleteFile(user.profileImage);
    }

    await updateUser(user.id, {profileImage: fileName});

    return actionSuccess({profileImage: fileName});
}