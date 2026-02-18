"use client";

import deleteAccountAction from "@/actions/auth/delete-account";
import FormSubmitButton from "@/components/form-submit-button";
import FormSubmitError from "@/components/form-submit-error";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";

export default function DeleteAccountForm() {
    const [state, action, pending] = useActionState(deleteAccountAction, undefined);

    return(
        <form className="flex flex-col gap-4" action={action}>
            <DialogHeader>
                <DialogTitle>
                    Delete account
                </DialogTitle>
                <DialogDescription>
                    Deleting your account is permanent. 
                    All your data will be wiped out immediately and you won&apos;t be able to get it back.
                </DialogDescription>
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
                        Confirm password
                    </Label>
                    <PasswordInput name="confirmPassword" id="confirmPassword"/>
                    <FormSubmitError errors={state?.errors?.confirmPassword}/>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                </DialogClose>
                <FormSubmitButton variant="destructive" pending={pending}>
                    Delete account
                </FormSubmitButton>
            </DialogFooter>
        </form>
    );
}