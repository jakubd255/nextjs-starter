"use server";

import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { validateRequest } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { deleteFile, extractFilenameFromUrl, isUploaded, uploadFile } from "@/lib/file-handler";

type AvatarAction =
  | { type: "upload"; file: File }
  | { type: "url"; url: string }
  | { type: "remove" };

const resolveAvatarAction = (data: FormData): AvatarAction | null => {
    const file = data.get("image");
    const url = data.get("url");
    const remove = data.get("remove") === "true";

    if(file && file instanceof File && file.size > 0) {
        return {type: "upload", file};
    }
    if(url && typeof url === "string" && url.length > 0) {
        return {type: "url", url};
    }
    if(remove) {
        return {type: "remove"};
    }

    return null;
}

export default async function updateAvatarAction(_: unknown, data: FormData) {
    const id = data.get("id") as string;
    if(!id) {
        return actionFailure();
    }

    const action = resolveAvatarAction(data);
    if(!action) {
        return actionFailure();
    }

    const [session, user] = await Promise.all([validateRequest(), getUserById(id)]);
    if(!session.user || ! user) {
        return actionFailure();
    }

    if(user.id !== session.user.id && !hasPermission(session.user, "user:update:profile")) {
        return actionFailure({permission: ["You dont have permission to update user's profile"]});
    }

    if(user.profileImage && isUploaded(user.profileImage)) {
        const path = extractFilenameFromUrl(user.profileImage);
        console.log(path);
        deleteFile(path);
    }

    switch(action.type) {
        case "upload": {
            const filename = await uploadFile(action.file);
            const profileImage = `${process.env.NEXT_PUBLIC_SITE_URL}/api/download/${filename}`;
            await updateUser(id, {profileImage});
            return actionSuccess({profileImage});
        }

        case "url": {
            await updateUser(id, {profileImage: action.url});
            return actionSuccess({profileImage: action.url});
        }

        case "remove": {
            await updateUser(id, {profileImage: null});
            return actionSuccess({profileImage: null});
        }
    }
}