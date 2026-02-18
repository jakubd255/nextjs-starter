"use client";

import setPasswordAction from "@/actions/auth/set-password";
import FormSubmitButton from "@/components/form-submit-button";
import FormSubmitError from "@/components/form-submit-error";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useRef } from "react";

export default function SetPasswordForm() {
    const [state, action, pending] = useActionState(setPasswordAction, undefined);

    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if(state?.success) ref.current?.click();
    }, [state]);
    
    return(
        <form className="flex flex-col gap-4" action={action}>
            <DialogHeader>
                <DialogTitle>
                    Set password
                </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
                <div>
                    <Label htmlFor="password">
                        Password
                    </Label>
                    <PasswordInput name="password" id="password"/>
                    <FormSubmitError errors={state?.errors?.password}/>
                </div>
                <div>
                    <Label htmlFor="confirmPassword">
                        Confirm new password
                    </Label>
                    <PasswordInput name="confirmPassword" id="confirmPassword"/>
                    <FormSubmitError errors={state?.errors?.confirmPassword}/>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" ref={ref}>
                        Cancel
                    </Button>
                </DialogClose>
                <FormSubmitButton pending={pending}>
                    Set password
                </FormSubmitButton>
            </DialogFooter>
        </form>
    );
}