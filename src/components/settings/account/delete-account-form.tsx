"use client";

import deleteAccountAction from "@/actions/auth/delete-account";
import ActionDialog from "@/components/kit/action-dialog";
import { PasswordField } from "@/components/kit/form/fields";
import { FieldGroup } from "@/components/kit/form/form";
import { useActionState } from "react";

export default function DeleteAccountForm() {
    const [state, action, pending] = useActionState(deleteAccountAction, undefined);

    return(
        <ActionDialog
            title="Delete account"
            description="Deleting your account is permanent. All your data will be wiped out immediately and you won't be able to get it back."
            variant="destructive"
            confirmText="Delete account"
            action={action}
            pending={pending}
        >
            <FieldGroup>
                <PasswordField
                    label="Password"
                    name="password"
                    errors={state?.errors?.password}
                    forgotPassword
                />
                <PasswordField
                    label="Confirm password"
                    name="confirmPassword"
                    errors={state?.errors?.confirmPassword}
                />
            </FieldGroup>
        </ActionDialog>
    );
}