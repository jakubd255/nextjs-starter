"use client";

import deleteUserAction from "@/actions/users/delete-user";
import { User } from "@/db/schema/users";
import { useFormAction } from "@/lib/hooks/use-form-action";
import { useDialogControl } from "@/components/kit/dialog-launcher";
import ActionDialog from "@/components/kit/action-dialog";

interface Props {
    user: User;
    redirect?: boolean;
}

export default function DeleteUserDialog({user, redirect=false}: Props) {
    const {close} = useDialogControl();
    const [_, action, pending] = useFormAction(() => deleteUserAction(user.id, redirect), {onSuccess: close});

    return(
        <ActionDialog
            title="Delete user"
            description={
                `This action will permanently delete ${user.name} and all associated data. `+
                `This operation cannot be undone. Please confirm that you want to proceed.`
            }
            variant="destructive"
            action={action}
            pending={pending}
            confirmText="Delete"
        />
    );
}