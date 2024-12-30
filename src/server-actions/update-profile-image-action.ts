"use server";

import { validateRequest } from "@/lib/auth/lucia";
import { updateUserImage } from "@/lib/db/user";
import { deleteFile, isLocalFile, uploadFile } from "@/lib/files";

export default async function updateProfileImageAction(_: unknown, data: FormData) {
    const image = data.get("image") as File | null;
    if(!image) {
        return {success: false, profileImage: null};
    }

    const {user} = await validateRequest();
    if(!user) {
        return {success: false, profileImage: null};
    }

    const fileName = await uploadFile(image);
    if(user.profileImage && isLocalFile(user.profileImage)) {
        deleteFile(user.profileImage);
    }

    await updateUserImage(user.id, fileName);

    return {success: true, profileImage: fileName};
}