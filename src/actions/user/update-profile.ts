"use server";

import { validateRequest } from "@/lib/auth";
import { updateUser } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { z } from "zod";

const schema = z.object({
    name: z.string().min(2).max(32),
    bio: z.string().nullable()
});

export default async function updateProfileAction(_: unknown, data: FormData) {
    const validationResult = schema.safeParse(
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