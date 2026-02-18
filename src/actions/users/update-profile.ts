"use server";

import { validateRequest } from "@/lib/auth";
import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { z } from "zod";
import { hasPermission } from "@/lib/auth/permissions";

const schema = z.object({
    id: z.string().min(10),
    name: z.string().min(2).max(32),
    bio: z.string().nullable().optional()
});

export default async function updateProfileAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = schema.safeParse(formData);

    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const {id, name, bio} = validationResult.data;

    const [session, user] = await Promise.all([validateRequest(), getUserById(id)]);
    if(!session.user || ! user) {
        return actionFailure();
    }

    if(user.id !== session.user.id && !hasPermission(session.user, "user:update:profile")) {
        return actionFailure({permission: ["You dont have permission to update user's profile"]});
    }
    
    await updateUser(user.id, {name, bio});
    
    return actionSuccess({name, bio});
}