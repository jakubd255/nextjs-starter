"use client";

import updatePasswordAction from "@/actions/auth/update-password";
import ActionDialog from "@/components/kit/action-dialog";
import { useDialogControl } from "@/components/kit/dialog-launcher";
import { PasswordField } from "@/components/kit/form/fields";
import { FieldGroup } from "@/components/kit/form/form";
import { useFormAction } from "@/lib/hooks/use-form-action";

export default function UpdatePasswordForm() {
    const {close} = useDialogControl();
    const [state, action, pending] = useFormAction(updatePasswordAction, {onSuccess: close});

    return(
        <ActionDialog 
            title="Update password"
            action={action} 
            pending={pending}
        >
            <FieldGroup>
                <PasswordField 
                    name="currentPassword" 
                    label="Current password" 
                    errors={state?.errors?.currentPassword} 
                    forgotPassword
                />
                <PasswordField 
                    name="newPassword" 
                    label="Mew password" 
                    errors={state?.errors?.newPassword}
                />
                <PasswordField 
                    name="confirmNewPassword" 
                    label="Confirm new password" 
                    errors={state?.errors?.confirmNewPassword}
                />
            </FieldGroup>
        </ActionDialog>
    );
}