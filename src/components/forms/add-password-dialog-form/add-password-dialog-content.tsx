/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import FormSubmitError from "@/components/form-submit-error";
import { useAccountSettings } from "@/components/providers/account-settins-provider";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import addPasswordAction from "@/server-actions/add-password-action";
import { useActionState, useEffect, useRef } from "react";

export default function AddPasswordDialogContent() {
    const [state, action] = useActionState(addPasswordAction, undefined);
    const {setPassword} = useAccountSettings();
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if(state?.success) {
            setPassword();
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
            <form id="addPasswordForm" action={action}>
                <Label htmlFor="password">
                    Password
                </Label>
                <Input type="password" name="password" id="password"/>
                <FormSubmitError errors={state?.errors?.password}/>
            </form>
            <DialogFooter>
                <DialogClose>
                    <Button variant="outline" ref={ref}>
                        Cancel
                    </Button>
                </DialogClose>
                <Button form="addPasswordForm">
                    Add password
                </Button>
            </DialogFooter>
        </>
    );
}