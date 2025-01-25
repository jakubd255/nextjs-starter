"use client";

import FormSubmitError from "@/components/form-submit-error";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAccountSettings } from "@/components/providers/account-settins-provider";
import FormSubmitButton from "@/components/form-submit-button";
import addEmailAction from "@/server-actions/user/add-email";
import useButtonRef from "@/hooks/useButtonRef";
import useActionStateSuccess from "@/hooks/useActionStateSuccess";


export default function AddEmailDialogContent() {
    const [email, setEmail] = useState<string>("");
    const {addEmail} = useAccountSettings();
    const {ref, click} = useButtonRef();

    const [state, action, pending] = useActionStateSuccess(addEmailAction, (state) => {
        addEmail(state.email);
        click();
    });

    return(
        <>
            <DialogHeader>
                <DialogTitle>
                    Add email
                </DialogTitle>
                <DialogDescription>
                    Add a new email address to your account. This email, once verified, can be used to login to your account.
                </DialogDescription>
            </DialogHeader>
            <form action={action} id="addEmail">
                <Label htmlFor="email">
                    Email
                </Label>
                <Input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)}/>
                <FormSubmitError errors={state?.errors?.email}/>
            </form>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" ref={ref}>
                        Cancel
                    </Button>
                </DialogClose>
                <FormSubmitButton form="addEmail" pending={pending} disabled={!email}>
                    Add email
                </FormSubmitButton>
            </DialogFooter>
        </>
    );
}