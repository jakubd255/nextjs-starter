"use client";

import { useActionState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import DeviceInfoCollector from "./device-info-collector";
import verifyEmailAction from "@/actions/auth/verify-account";
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
                <Input type="text" name="code" id="ecodel"/>
                <FormSubmitError errors={state?.errors?.code}/>
            </div>
            <input type="hidden" name="userId" defaultValue={userId} hidden/>
            <DeviceInfoCollector/>
            <FormSubmitButton pending={pending}>
                Verify E-mail
            </FormSubmitButton>
        </form>
    );
}