"use client";

import { ActionResult } from "@/types";
import { useActionState } from "react";

type ReturnType = [ActionResult | undefined, (payload: FormData) => void, boolean]

export default function useActionStateSuccess(
    serverAction: (state: unknown, data: FormData) => Promise<ActionResult>,
    success: (actionState: ActionResult) => void
): ReturnType {
    const [state, originalAction, pending] = useActionState(async (_: unknown, data: FormData) => {
        const actionState = await serverAction(_, data);

        if(actionState.success) {
            success(actionState);
        }

        return actionState;

    }, undefined);

    const action = originalAction as (payload: FormData) => void;
    //((formData: FormData) => ActionResult) | undefined;

    return [state, action, pending];
}