"use client";

import updateEmailAction from "@/actions/auth/update-email";
import ActionDialog from "@/components/kit/action-dialog";
import { useDialogControl } from "@/components/kit/dialog-launcher";
import { TextField } from "@/components/kit/form/fields";
import { useFormAction } from "@/lib/hooks/use-form-action";

export default function UpdateEmailForm() {
    const {close} = useDialogControl();
    const [state, action, pending] = useFormAction(updateEmailAction, {onSuccess: close});

    return(
        <ActionDialog 
            title="Update email"
            description="Update your e-mail address. New e-mail will be active after verification."
            action={action} 
            pending={pending}
        >
            <TextField 
                type="email" 
                name="email" 
                label="Email" 
                defaultValue={state?.email}
                errors={state?.errors?.email}
            />
        </ActionDialog>
    );
}