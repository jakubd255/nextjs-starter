"use client";

import { useActionState } from "react";
import FormSubmitButton from "../form-submit-button";
import FormSubmitError from "../form-submit-error";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import requestResetPasswordAction from "@/actions/auth/request-reset-password";

export default function RequestResetPassword() {
    const [state, action, pending] = useActionState(requestResetPasswordAction, undefined);
    
    return(
        <form className="flex flex-col gap-6" action={action}>
            <div>
                <Label htmlFor="code">
                    E-mail
                </Label>
                <Input type="email" name="email" id="email"/>
                <FormSubmitError errors={state?.errors?.code}/>
            </div>
            <FormSubmitButton pending={pending}>
                Next
            </FormSubmitButton>
        </form>
    );
}