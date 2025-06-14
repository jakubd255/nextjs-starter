"use server";

import { deleteUserById } from "@/db/queries/users";
import { actionFailure, actionSuccess } from "@/lib/action-result";
import { validateRequest } from "@/lib/auth";

export default async function deleteUserAction(id: string) {
    const request = await validateRequest();
    if(!request.user || request.user.role !== "ADMIN") {
        return actionFailure();
    }

    const result = await deleteUserById(id);
    if(!result) {
        return actionFailure();
    }

    return actionSuccess();
}