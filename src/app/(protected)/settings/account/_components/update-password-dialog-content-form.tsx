"use client";

import FormSubmitError from "@/components/form-submit-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useActionStateSuccess from "@/hooks/use-action-state-success";
import useButtonRef from "@/hooks/use-button-ref";
import updatePasswordAction from "@/actions/auth/update-password";
import DialogContentProvider from "@/components/dialog-content-provider";
import useShowPassword from "@/hooks/use-show-password";
import ShowPasswordToggle from "@/components/show-password-toggle";

export default function UpdatePasswordDialogContentForm() {
    const {ref, click} = useButtonRef();

    const [showCurrentPassword, toggleShowCurrentPassword] = useShowPassword();
    const [showNewPassword, toggleShowNewPassword] = useShowPassword();

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
            <form 
                action={action}
                className="flex flex-col gap-2" 
                id="addPasswordForm" 
            >
                <div>
                    <Label htmlFor="currentPassword">
                        Current password
                    </Label>
                    <div className="flex gap-1">
                        <Input 
                            type={showCurrentPassword ? "text" : "password"} 
                            name="currentPassword" 
                            id="currentPassword"
                        />
                        <ShowPasswordToggle 
                            showPassword={showCurrentPassword} 
                            toggleShowPassword={toggleShowCurrentPassword}
                        />
                    </div>
                    <FormSubmitError errors={state?.errors?.currentPassword}/>
                </div>
                <div>
                    <Label htmlFor="newPassword">
                        New password
                    </Label>
                    <div className="flex gap-1">
                        <Input 
                            type={showNewPassword ? "text" : "password"} 
                            name="newPassword" 
                            id="newPassword"
                        />
                        <ShowPasswordToggle 
                            showPassword={showNewPassword} 
                            toggleShowPassword={toggleShowNewPassword}
                        />
                    </div>
                    <FormSubmitError errors={state?.errors?.newPassword}/>
                </div>
            </form>
        </DialogContentProvider>
    );
}