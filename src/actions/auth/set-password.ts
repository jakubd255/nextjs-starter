"use server";

import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure } from "@/lib/action-result";
import { validateRequest } from "@/lib/auth";
import { passwordSchema } from "@/lib/validation/auth";
import { redirect } from "next/navigation";

export default async function setPasswordAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = passwordSchema.safeParse(formData);

    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const session = await validateRequest();
    if(!session.user) {
        return actionFailure();
    }
    
    const user = await getUserById(session.user.id);
    if(!user || user.password) {
        return actionFailure();
    }

    const {password} = validationResult.data;

    await updateUser(user.id, {password});

    redirect("/settings/account");
}