"use client";

import resentVerificationTokenAction from "@/server-actions/resend-verification-token-action";
import FormSubmitButton from "../form-submit-button";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

export default function ResendVerificationTokenForm() {
    const searchParams = useSearchParams();
    const emailId = searchParams.get("emailId") ?? "";
    
    const [state, action] = useActionState(resentVerificationTokenAction, undefined);

    return(
        <form action={action}>
            <input type="hidden" name="emailId" value={emailId} hidden/>
            <FormSubmitButton variant="link">
                Resend code
            </FormSubmitButton>
        </form>
    );
}