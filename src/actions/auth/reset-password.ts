"use server";

import { getTokenByCode } from "@/db/queries/tokens";
import { updateUser } from "@/db/queries/users";
import { actionFailure } from "@/lib/action-result";
import { redirect } from "next/navigation";
import z from "zod";

const schema = z.object({
    code: z.string().min(8),
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8)
})
.refine(data => {
    return data.newPassword === data.confirmNewPassword
}, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"]
});

export default async function resetPasswordAction(_: unknown, data: FormData) {
    const formData = Object.fromEntries(data.entries());
    const validationResult = schema.safeParse(formData);
    
    if(!validationResult.success) {
        return actionFailure(validationResult.error?.flatten().fieldErrors);
    }

    const {code, newPassword} = validationResult.data;

    const token = await getTokenByCode(code);
    if(!token) {
        return actionFailure({});
    }

    await updateUser(token.userId, {password: newPassword});

    redirect("/auth/log-in");
}