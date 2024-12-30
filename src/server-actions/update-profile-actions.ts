"use server";

import { validateRequest } from "@/lib/auth/lucia";
import { updateUserProfile } from "@/lib/db/user";
import { updateProfileSchema } from "@/lib/form-schema";

export default async function updateProfileAction(_: unknown, data: FormData) {
    const validationResult = updateProfileSchema.safeParse(
        Object.fromEntries(data.entries())
    );
    if(!validationResult.success) {
        return {errors: validationResult.error?.flatten().fieldErrors};
    }

    const {user} = await validateRequest();
    if(!user) {
        return {errors: {}};
    }

    const {name, bio} = validationResult.data;

    await updateUserProfile(user.id, name, bio);
    
    return {errors: {name: [], bio: []}, success: true};
}