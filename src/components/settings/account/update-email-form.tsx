"use client";

import updateEmailAction from "@/actions/auth/update-email";
import FormSubmitButton from "@/components/form-submit-button";
import FormSubmitError from "@/components/form-submit-error";
import { useSession } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useRef } from "react";

export default function UpdateEmailForm() {
    const [state, action, pending] = useActionState(updateEmailAction, undefined);

    const {updateUser} = useSession();
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if(state?.success && state?.cancel) {
            updateUser({email: state.email, pendingEmail: null});
        }
        else if(state?.success) {
            updateUser({pendingEmail: state.email});
            ref.current?.click();
        }
    }, [state]);

    return(
        <form className="flex flex-col gap-4" action={action}>
            <DialogHeader>
                <DialogTitle>
                    Change e-mail
                </DialogTitle>
                <DialogDescription>
                    Update your e-mail address.
                    New e-mail will be active after verification.
                </DialogDescription>
            </DialogHeader>
            <div>
                <Label htmlFor="email">
                    Email
                </Label>
                <Input type="email" name="email" id="email" defaultValue={state?.email}/>
                <FormSubmitError errors={state?.errors?.email}/>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" ref={ref}>
                        Cancel
                    </Button>
                </DialogClose>
                <FormSubmitButton pending={pending}>
                    Change email
                </FormSubmitButton>
            </DialogFooter>
        </form>
    );
}