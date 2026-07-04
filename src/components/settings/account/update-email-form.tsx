"use client";

import updateEmailAction from "@/actions/auth/update-email";
import FormSubmitButton from "@/components/form-submit-button";
import FormSubmitError from "@/components/form-submit-error";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormAction } from "@/lib/hooks/use-form-action";
import { useRef } from "react";

export default function UpdateEmailForm() {
    const ref = useRef<HTMLButtonElement>(null);

    const [state, action, pending] = useFormAction(updateEmailAction, {onSuccess: () => {ref.current?.click();}})

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
                    <Button type="button" variant="outline" ref={ref}>
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