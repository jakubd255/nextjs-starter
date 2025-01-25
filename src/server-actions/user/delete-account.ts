"use server";

import lucia, { validateRequest } from "@/lib/auth";
import { validatePassword } from "@/lib/auth/password";
import { deleteUserById, findUserById } from "@/lib/db/queries/users";
import { actionFailure } from "@/lib/types/action-result";
import { passwordSchema } from "@/lib/validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function deleteAccountAction(_: unknown, data: FormData) {
    const validationResult = passwordSchema.safeParse(
        Object.fromEntries(data.entries())
    );
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const request = await validateRequest();
    if(!request.user) {
        return actionFailure();
    }

    const {password} = validationResult.data;

    const user = await findUserById(request.user.id);
    if(!user) {
        return actionFailure();
    }

    if(!validatePassword(password, user.password)) {
        return actionFailure({password: ["Invalid password"]});
    }

    const result = await deleteUserById(user.id);
    if(!result) {
        return actionFailure();
    }

    const sessionCookie = lucia.createBlankSessionCookie();
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    redirect("/auth/log-in");
}