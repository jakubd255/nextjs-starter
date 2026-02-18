"use client";

import { useActionState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import verifyEmailAction from "@/actions/auth/verify-email";
import FormSubmitError from "../form-submit-error";
import FormSubmitButton from "../form-submit-button";

interface VerifyEmailFormProps {
    userId: string;
}

export default function VerifyEmailForm({userId}: VerifyEmailFormProps) {
    const [state, action, pending] = useActionState(verifyEmailAction, undefined);
    
    return(
        <form className="flex flex-col gap-6" action={action}>
            <div>
                <Label htmlFor="code">
                    Verification code
                </Label>
                <Input type="text" name="code" id="code"/>
                <FormSubmitError errors={state?.errors?.code}/>
            </div>
            <input type="hidden" name="userId" defaultValue={userId} hidden/>
            <FormSubmitButton pending={pending}>
                Verify E-mail
            </FormSubmitButton>
        </form>
    );
}