"use server";

import { validateRequest } from "@/lib/auth/lucia";
import { deleteUserById } from "@/lib/db/user";
import logoutAction from "./logout-action";

export default async function deleteAccountAction() {
    const {user} = await validateRequest();
    if(!user) {
        throw Error("User not found");
    }

    await deleteUserById(user.id);
    await logoutAction();
}