"use client";

import resendVerificationTokenAction from "@/server-actions/auth/resend-verification-token";
import FormSubmitButton from "../form-submit-button";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

export default function ResendVerificationTokenForm() {
    const searchParams = useSearchParams();
    const emailId = searchParams.get("emailId") ?? "";
    
    const [_, action, pending] = useActionState(resendVerificationTokenAction, undefined);

    return(
        <form action={action}>
            <input type="hidden" name="emailId" value={emailId} hidden/>
            <FormSubmitButton variant="link" pending={pending}>
                Resend code
            </FormSubmitButton>
        </form>
    );
}