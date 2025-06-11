"use client";

import FormSubmitError from "@/components/form-submit-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useActionStateSuccess from "@/hooks/use-action-state-success";
import useButtonRef from "@/hooks/use-button-ref";
import updatePasswordAction from "@/actions/auth/update-password";
import DialogContentProvider from "@/components/dialog-content-provider";

export default function UpdatePasswordDialogContentForm() {
    const {ref, click} = useButtonRef();

    const [state, action, pending] = useActionStateSuccess(updatePasswordAction, () => {
        click();
    });
    
    return(
        <DialogContentProvider 
            title="Update password"
            confirm="Update password"
            pending={pending}
            ref={ref}
            form="addPasswordForm"
        >
            <form className="flex flex-col gap-2" id="addPasswordForm" action={action}>
                <div>
                    <Label htmlFor="currentPassword">
                        Current password
                    </Label>
                    <Input type="password" name="currentPassword" id="currentPassword"/>
                    <FormSubmitError errors={state?.errors?.currentPassword}/>
                </div>
                <div>
                    <Label htmlFor="newPassword">
                        New password
                    </Label>
                    <Input type="password" name="newPassword" id="newPassword"/>
                    <FormSubmitError errors={state?.errors?.newPassword}/>
                </div>
            </form>
        </DialogContentProvider>
    );
}