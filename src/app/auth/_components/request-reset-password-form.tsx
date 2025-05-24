"use client";

import FormSubmitError from "@/components/form-submit-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import requestResetPasswordAction from "@/actions/auth/request-reset-password";
import { useActionState } from "react";

export default function RequestResetPasswordForm() {
    const [state, action] = useActionState(requestResetPasswordAction, undefined);

    return(
        <form action={action} className="flex flex-col gap-4">
            <div>
                <Label htmlFor="email">
                    E-mail
                </Label>
                <Input type="email" name="email" id="email" defaultValue={state?.email}/>
                <FormSubmitError errors={state?.errors?.email}/>
            </div>
            <Button>
                Next
            </Button>
        </form>
    );
}