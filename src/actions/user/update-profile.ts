"use server";

import { validateRequest } from "@/lib/auth";
import { updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { z } from "zod";
import { deleteFile, isLocalFile, uploadFile } from "@/lib/file-handler";

const schema = z.object({
    name: z.string().min(2).max(32),
    bio: z.string().nullable().optional(),
    image: z
    .union([
        z.instanceof(File, {
            message: "Image is required"
        }),
        z.string().optional()
    ])
    .refine((value) => value instanceof File || typeof value === "string", {
        message: "Image is required"
    }),
    deleteImage: z.preprocess((v) => v === "true" || v === true, z.boolean().default(false))
});

export default async function updateProfileAction(_: unknown, data: FormData) {
    const validationResult = schema.safeParse(
        Object.fromEntries(data.entries())
    );
    if(!validationResult.success) {
        console.log(validationResult.error?.flatten().fieldErrors);
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const {user} = await validateRequest();
    if(!user) {
        return actionFailure();
    }

    const {name, bio, image, deleteImage} = validationResult.data;

    let fileName = user.profileImage;

    if(image instanceof File && image.size > 0) {
        fileName = await uploadFile(image);
        if(user.profileImage && isLocalFile(user.profileImage)) {
            deleteFile(user.profileImage);
        }
    } 
    else if(deleteImage && user.profileImage) {
        fileName = null;
        deleteFile(user.profileImage);
    }

    await updateUser(user.id, {name, bio, profileImage: fileName});
    
    return actionSuccess({name, bio, profileImage: fileName});
}