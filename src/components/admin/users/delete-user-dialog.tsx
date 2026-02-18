"use client";

import { useActionState } from "react";
import deleteUserAction from "@/actions/users/delete-user";
import { User } from "@/lib/types";
import { ActionResult } from "@/lib/action-result";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormSubmitButton from "@/components/form-submit-button";

interface DeleteUserDialogProps {
    user: User;
    redirect?: boolean;
    onDelete?: (result: ActionResult) => void;
}

export default function DeleteUserDialog({user, redirect=false, onDelete}: DeleteUserDialogProps) {
    const [_, action, pending] = useActionState(async () => {
        const result = await deleteUserAction(user.id, redirect);
        onDelete?.(result);
        return result;
    }, undefined);

    return(
        <form className="flex flex-col gap-4" action={action}>
            <DialogHeader>
                <DialogTitle>
                    Delete user
                </DialogTitle>
                <DialogDescription>
                    This action will permanently delete {user.name} and all associated data. 
                    This operation cannot be undone. Please confirm that you want to proceed.
                </DialogDescription>
            </DialogHeader>
            <input type="hidden" name="id" defaultValue={user.id} hidden/>
            <input type="hidden" name="redirect" defaultValue={String(redirect)} hidden/>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                </DialogClose>
                <FormSubmitButton variant="destructive" pending={pending}>
                    Delete
                </FormSubmitButton>
            </DialogFooter>
        </form>
    );
}