"use client";

import FormSubmitError from "@/components/form-submit-error";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import updatePasswordAction from "@/server-actions/update-password-action";
import { useActionState, useEffect, useRef } from "react";

export default function UpdatePasswordDialogContent() {
    const [state, action] = useActionState(updatePasswordAction, undefined);
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if(state?.success) {
            ref.current?.click();
        }
    }, [state]);
    
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
                <DialogClose>
                    <Button variant="outline" ref={ref}>
                        Cancel
                    </Button>
                </DialogClose>
                <Button form="addPasswordForm">
                    Update password
                </Button>
            </DialogFooter>
        </>
    );
}