"use server";

import { deleteUserById, getUserById } from "@/db/queries/users";
import { actionFailure } from "@/lib/action-result";
import { terminateSession, validateRequest } from "@/lib/auth";
import { validatePassword } from "@/lib/auth/password";
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

export default async function deleteAccountAction(_: unknown, data: FormData) {
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
    if(!user) {
        return actionFailure();
    }

    if(!user.password) {
        return actionFailure({password: ["Password is not set yet"]});
    }

    const {password} = validationResult.data;

    if(!validatePassword(password, user.password)) {
        return actionFailure({password: ["Invalid password"]});
    }

    deleteUserById(user.id);

    terminateSession(session.session.id);

	redirect("/auth/log-in");
}