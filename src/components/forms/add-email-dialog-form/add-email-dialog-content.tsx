/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import FormSubmitError from "@/components/form-submit-error";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useRef, useState } from "react";
import addEmailAction from "@/server-actions/add-email-action";
import { useAccountSettings } from "@/components/providers/account-settins-provider";
import FormSubmitButton from "@/components/form-submit-button";


export default function AddEmailDialogContent() {
    const [email, setEmail] = useState<string>("");
    const [state, action] = useActionState(addEmailAction, undefined);
    const {addEmail} = useAccountSettings();
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if(state?.result) {
            addEmail(state.result);
            ref.current?.click();
        }
    }, [state]);

    return(
        <form className="flex flex-col gap-4" action={action}>
            <DialogHeader>
                <DialogTitle>
                    Add email
                </DialogTitle>
                <DialogDescription>
                    Add a new email address to your account. This email, once verified, can be used to login to your account.
                </DialogDescription>
            </DialogHeader>
            <div>
                <Label htmlFor="email">
                    Email
                </Label>
                <Input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)}/>
                <FormSubmitError errors={state?.errors.email}/>
            </div>
            <DialogFooter>
                <DialogClose>
                    <Button variant="outline" ref={ref}>
                        Cancel
                    </Button>
                </DialogClose>
                <FormSubmitButton disabled={!email}>
                    Add email
                </FormSubmitButton>
            </DialogFooter>
        </form>
    );
}