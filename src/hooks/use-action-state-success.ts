"use client";

import { useActionState } from "react";

export default function useActionStateSuccess(
    serverAction: (state: unknown, data: FormData) => Promise<any>,
    success: (actionState: any) => void
) {
    const [state, originalAction, pending] = useActionState(async (_: unknown, data: FormData) => {
        const actionState = await serverAction(_, data);

        if(actionState.success) {
            success(actionState);
        }

        return actionState;

    }, undefined);

    const action = originalAction as ((formData: FormData) => void) | undefined;

    return [state, action, pending];
}