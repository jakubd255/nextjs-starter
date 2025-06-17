"use client";

import FormSubmitError from "@/components/form-submit-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import deleteAccountAction from "@/actions/user/delete-account";
import { useActionState } from "react";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormSubmitButton from "@/components/form-submit-button";

export default function DeleteAccountForm() {
    const [state, action,] = useActionState(deleteAccountAction, undefined);

    return(
        <>
            <DialogHeader>
                <DialogTitle>
                    Delete account
                </DialogTitle>
                <DialogDescription>
                    Deleting your account is permanent. 
                    All your data will be wiped out immediately and you won&apos;t be able to get it back.
                </DialogDescription>
            </DialogHeader>
            <form action={action} id="deleteAccountForm">
                <div>
                    <Label htmlFor="password">
                        Password
                    </Label>
                    <Input type="password" name="password" id="password"/>
                    <FormSubmitError errors={state?.errors?.password}/>
                </div>
            </form>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">
                        Cancel
                    </Button>
                </DialogClose>
                <FormSubmitButton 
                    variant="destructive"
                    form="deleteAccountForm"
                >
                    Delete account
                </FormSubmitButton>
            </DialogFooter>
        </>
    );
}