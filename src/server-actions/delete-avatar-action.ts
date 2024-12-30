"use server";

import { validateRequest } from "@/lib/auth/lucia";
import { updateUserImage } from "@/lib/db/user";
import { deleteFile, isLocalFile } from "@/lib/files";

export default async function deleteAvatarAction() {
    const {user} = await validateRequest();
    if(!user) {
        return {success: false};
    }

    if(user.profileImage && isLocalFile(user.profileImage)) {
        deleteFile(user.profileImage);
    }
    await updateUserImage(user.id, null);

    return {success: true};
}