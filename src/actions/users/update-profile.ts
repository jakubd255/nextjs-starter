"use server";

import { validateRequest } from "@/lib/auth/session";
import { getUserById, updateUser } from "@/db/queries/users";
import { hasPermission } from "@/lib/auth/permissions";
import { updateProfileSchema } from "@/lib/validation/user";
import { revalidatePath } from "next/cache";
import { actionFailure, actionSuccess } from "@/lib/utils/action-result";

export default async function updateProfileAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = updateProfileSchema.safeParse(formData);

    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors).build();
    }

    const {id, name, bio} = validationResult.data;

    const [session, user] = await Promise.all([validateRequest(), getUserById(id)]);
    if(!session.user || ! user) {
        return  actionFailure().build();
    }

    if(user.id !== session.user.id && !hasPermission(session.user, "user:update:profile")) {
        return  actionFailure().message("You dont have permission to update user's profile").build();
    }
    
    await updateUser(user.id, {name, bio});

    revalidatePath("/");
    
    return  actionSuccess().build();
}