"use server";

import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/utils/action-result";
import { validateRequest } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import { storage } from "@/lib/storage";

type AvatarAction = | {type: "upload"; file: File} | {type: "url"; url: string} | {type: "remove"};

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
        return actionFailure().build();
    }

    const action = resolveAvatarAction(data);
    if(!action) {
        return actionFailure().build();
    }

    const [session, user] = await Promise.all([validateRequest(), getUserById(id)]);
    if(!session.user || ! user) {
        return actionFailure().build();
    }

    if(user.id !== session.user.id && !hasPermission(session.user, "user:update:profile")) {
        return actionFailure().message("You dont have permission to update user's profile").build();
    }

    const oldImage = user.profileImage;

    switch(action.type) {
        case "upload": {
            const {url} = await storage.upload(action.file);
            await updateUser(id, {profileImage: url});
            break;
        }

        case "url": {
            await updateUser(id, {profileImage: action.url});
            break;
        }

        case "remove": {
            await updateUser(id, {profileImage: null});
            break;
        }
    }

    if(oldImage && storage.owns(oldImage)) {
        await storage.delete(oldImage);
    }

    revalidatePath("/");
    
    return actionSuccess().build();
}