"use server";

import { validateRequest } from "@/lib/auth";
import { updateUser } from "@/lib/db/queries/users";
import { deleteFile, isLocalFile } from "@/lib/file-handler";
import { actionFailure, actionSuccess } from "@/lib/types/action-result";

export default async function deleteProfileImageAction() {
    const {user} = await validateRequest();
    if(!user) {
        return actionFailure();
    }

    if(user.profileImage && isLocalFile(user.profileImage)) {
        deleteFile(user.profileImage);
    }
    await updateUser(user.id, {profileImage: null});

    return actionSuccess();
}