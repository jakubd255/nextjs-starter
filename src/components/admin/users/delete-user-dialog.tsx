"use client";

import deleteUserAction from "@/actions/users/delete-user";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormSubmitButton from "@/components/form-submit-button";
import { User } from "@/db/schema/users";
import { useFormAction } from "@/lib/hooks/use-form-action";

interface DeleteUserDialogProps {
    user: User;
    redirect?: boolean;
    onSuccess?: () => void;
}

export default function DeleteUserDialog({user, redirect=false, onSuccess}: DeleteUserDialogProps) {
    const [_, action, pending] = useFormAction(() => deleteUserAction(user.id, redirect), {onSuccess});

    return(
        <form className="flex flex-col gap-4" action={action}>
            <DialogHeader>
                <DialogTitle>
                    Delete user
                </DialogTitle>
                <DialogDescription>
                    This action will permanently delete <b>{user.name}</b> and all associated data. 
                    This operation cannot be undone. Please confirm that you want to proceed.
                </DialogDescription>
            </DialogHeader>
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