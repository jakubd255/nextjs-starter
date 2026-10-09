"use client";

import setPasswordAction from "@/actions/auth/set-password";
import ActionDialog from "@/components/kit/action-dialog";
import { useDialogControl } from "@/components/kit/dialog-launcher";
import { PasswordField } from "@/components/kit/form/fields";
import { FieldGroup } from "@/components/kit/form/form";
import { useFormAction } from "@/lib/hooks/use-form-action";

export default function SetPasswordForm() {
    const {close} = useDialogControl();
    const [state, action, pending] = useFormAction(setPasswordAction, {onSuccess: close});

    return(
        <ActionDialog 
            title="Set password"
            action={action} 
            pending={pending}
        >
            <FieldGroup>
                <PasswordField 
                    name="password" 
                    label="Password" 
                    errors={state?.errors?.password}
                />
                <PasswordField 
                    name="confirmPassword" 
                    label="Confirm password" 
                    errors={state?.errors?.confirmPassword}
                />
            </FieldGroup>
        </ActionDialog>
    );
}