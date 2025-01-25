"use server";

import { validateRequest } from "@/lib/auth";
import { updateUser } from "@/lib/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/types/action-result";
import { updateProfileSchema } from "@/lib/validation";

export default async function updateProfileAction(_: unknown, data: FormData) {
    const validationResult = updateProfileSchema.safeParse(
        Object.fromEntries(data.entries())
    );
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const {user} = await validateRequest();
    if(!user) {
        return actionFailure();
    }

    const {name, bio} = validationResult.data;

    await updateUser(user.id, {name, bio});
    
    return actionSuccess({name, bio});
}