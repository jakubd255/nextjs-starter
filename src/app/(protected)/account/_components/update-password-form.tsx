"use client";

import FormSubmitError from "@/components/form-submit-error";
import { Label } from "@/components/ui/label";
import useActionStateSuccess from "@/lib/hooks/use-action-state-success";
import updatePasswordAction from "@/actions/auth/update-password";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormSubmitButton from "@/components/form-submit-button";
import { useRef } from "react";
import PasswordInput from "@/components/password-input";

export default function UpdatePasswordForm() {
    const ref = useRef<HTMLButtonElement>(null);

    const [state, action, pending] = useActionStateSuccess(updatePasswordAction, () => {
        ref.current?.click();
    });

    return(
        <>
            <DialogHeader>
                <DialogTitle>
                    Update password
                </DialogTitle>
            </DialogHeader>
            <form action={action} id="addPasswordForm">
                <div className="flex flex-col gap-2">
                    <div>
                        <Label htmlFor="currentPassword">
                            Current password
                        </Label>
                        <PasswordInput id="currentPassword" name="currentPassword"/>
                        <FormSubmitError errors={state?.errors?.currentPassword}/>
                    </div>
                    <div>
                        <Label htmlFor="newPassword">
                            New password
                        </Label>
                        <PasswordInput id="newPassword" name="newPassword"/>
                        <FormSubmitError errors={state?.errors?.newPassword}/>
                    </div>
                </div>
            </form>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" ref={ref}>
                        Cancel
                    </Button>
                </DialogClose>
                <FormSubmitButton 
                    form="addPasswordForm"
                    pending={pending} 
                >
                    Update password
                </FormSubmitButton>
            </DialogFooter>
        </>
    );
}