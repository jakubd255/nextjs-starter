"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import verifyEmailAction from "@/server-actions/verify-email-action";
import { MailCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import FormSubmitError from "../form-submit-error";
import FormSubmitButton from "../form-submit-button";
import { useActionState } from "react";

export default function VerifyEmailForm() {
    const searchParams = useSearchParams();
    const emailId = searchParams.get("emailId") ?? "";

    const [state, action] = useActionState(verifyEmailAction, undefined);

    return(
        <form action={action} className="flex flex-col gap-4 w-full max-w-[400px]">
            <h1 className="text-center">
                Verify email
            </h1>
            <div>
                <Label htmlFor="code">
                    Verification code
                </Label>
                <Input type="text" name="code" id="code" maxLength={6} minLength={6}/>
                <Input type="hidden" name="emailId" value={emailId}/>
                <FormSubmitError errors={state?.errors.code}/>
            </div>
            <FormSubmitButton>
                <MailCheck className="mr-2"/>
                Verify email
            </FormSubmitButton>
        </form>
    );
}