"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import FormSubmitError from "@/components/form-submit-error";
import FormSubmitButton from "@/components/form-submit-button";
import { useActionState } from "react";
import verifyEmailAction from "@/actions/auth/verify-email";
import DeviceInfoCollector from "./device-info-collector";

export default function VerifyEmailForm() {
    const searchParams = useSearchParams();
    const emailId = searchParams.get("emailId") ?? "";
    const [state, action, pending] = useActionState(verifyEmailAction, undefined);

    return(
        <form action={action} className="flex flex-col gap-4 w-full max-w-[400px]">
            <h1 className="text-center">
                Verify email
            </h1>
            <div>
                <Label htmlFor="code">
                    Verification code
                </Label>
                <Input 
                    type="text" 
                    name="code" 
                    id="code" 
                    maxLength={6} 
                    minLength={6}
                />
                <Input 
                    type="hidden" 
                    name="emailId" 
                    value={emailId}
                />
                <DeviceInfoCollector/>
                <FormSubmitError errors={state?.errors?.code}/>
            </div>
            <FormSubmitButton pending={pending}>
                <MailCheck className="mr-2"/>
                Verify email
            </FormSubmitButton>
        </form>
    );
}