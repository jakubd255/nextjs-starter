"use server";

import { getUserById, updateUser } from "@/db/queries/users";
import { actionFailure } from "@/lib/action-result";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import z from "zod";

const schema = z.object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
})
.refine(data => {
    return data.password === data.confirmPassword
}, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export default async function setPasswordAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = schema.safeParse(formData);

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