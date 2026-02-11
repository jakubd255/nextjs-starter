"use client";

import updatePasswordAction from "@/actions/auth/update-password";
import FormSubmitButton from "@/components/form-submit-button";
import FormSubmitError from "@/components/form-submit-error";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";

export default function UpdatePasswordForm() {
    const [state, action, pending] = useActionState(updatePasswordAction, undefined);

    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if(state?.success) {
            ref.current?.click();
        }
    }, [state]);
    
    return(
        <form className="flex flex-col gap-4" action={action}>
            <DialogHeader>
                <DialogTitle>
                    Change password
                </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
                <div>
                    <div className="flex justify-between">
                        <Label htmlFor="currentPassword">
                            Current password
                        </Label>
                        <Link className="font-bold text-sm text-primary hover:underline" href="/auth/forgot-password" >
                            Forgot password?
                        </Link>
                    </div>
                    <PasswordInput name="currentPassword" id="currentPassword"/>
                    <FormSubmitError errors={state?.errors?.currentPassword}/>
                </div>
                <div>
                    <Label htmlFor="newPassword">
                        New password
                    </Label>
                    <PasswordInput name="newPassword" id="newPassword"/>
                    <FormSubmitError errors={state?.errors?.newPassword}/>
                </div>
                <div>
                    <Label htmlFor="confirmNewPassword">
                        Confirm new password
                    </Label>
                    <PasswordInput name="confirmNewPassword" id="confirmNewPassword"/>
                    <FormSubmitError errors={state?.errors?.confirmNewPassword}/>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" ref={ref}>
                        Cancel
                    </Button>
                </DialogClose>
                <FormSubmitButton pending={pending}>
                    Change password
                </FormSubmitButton>
            </DialogFooter>
        </form>
    );
}