"use client";

import FormSubmitButton from "@/components/form-submit-button";
import FormSubmitError from "@/components/form-submit-error";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useActionStateSuccess from "@/hooks/use-action-state-success";
import useButtonRef from "@/hooks/use-button-ref";
import updatePasswordAction from "@/actions/auth/update-password";

export default function UpdatePasswordDialogContentForm() {
    const {ref, click} = useButtonRef();

    const [state, action, pending] = useActionStateSuccess(updatePasswordAction, () => {
        click();
    });
    
    return(
        <>
            <DialogHeader>
                <DialogTitle>
                    Add password
                </DialogTitle>
            </DialogHeader>
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
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" ref={ref}>
                        Cancel
                    </Button>
                </DialogClose>
                <FormSubmitButton form="addPasswordForm" pending={pending}>
                    Update password
                </FormSubmitButton>
            </DialogFooter>
        </>
    );
}