"use client";

import FormSubmitError from "@/components/form-submit-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import deleteAccountAction from "@/actions/user/delete-account";
import { useActionState } from "react";
import DialogContentProvider from "@/components/dialog-content-provider";

export default function DeleteAccountDialogContentForm() {
    const [state, action] = useActionState(deleteAccountAction, undefined);

    return(
        <DialogContentProvider
            title="Delete account"
            confirm="Delete account"
            form="deleteAccountForm"
            description={`
                Deleting your account is permanent.\n
                All your data will be wiped out immediately and you won't be able to get it back.
            `}
            destructive
        >
            <form action={action} id="deleteAccountForm">
                <div>
                    <Label htmlFor="password">
                        Password
                    </Label>
                    <Input type="password" name="password" id="password"/>
                    <FormSubmitError errors={state?.errors?.password}/>
                </div>
            </form>
        </DialogContentProvider>
    );
}