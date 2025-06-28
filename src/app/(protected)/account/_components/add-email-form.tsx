"use client";

import FormSubmitError from "@/components/form-submit-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import addEmailAction from "@/actions/user/add-email";
import useActionStateSuccess from "@/lib/hooks/use-action-state-success";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormSubmitButton from "@/components/form-submit-button";
import { useAccountSettings } from "./account-settings-provider";

export default function AddEmailForm() {
    const [email, setEmail] = useState<string>("");
    const {addEmail} = useAccountSettings();
    const ref = useRef<HTMLButtonElement>(null)

    const [state, action, pending] = useActionStateSuccess(addEmailAction, (state) => {
        addEmail(state.email);
        ref.current?.click();
    });

    return(
        <>
            <DialogHeader>
                <DialogTitle>
                    Add email
                </DialogTitle>
                <DialogDescription>
                    Add a new email address to your account. 
                    This email, once verified, can be used to login to your account.
                </DialogDescription>
            </DialogHeader>
            <form action={action} id="addEmail">
                <Label htmlFor="email">
                    Email
                </Label>
                <Input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                />
                <FormSubmitError errors={state?.errors?.email}/>
            </form>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" ref={ref}>
                        Cancel
                    </Button>
                </DialogClose>
                <FormSubmitButton 
                    variant="destructive"
                    form="addEmail" 
                    pending={pending} 
                >
                    Add email
                </FormSubmitButton>
            </DialogFooter>
        </>
    );
}