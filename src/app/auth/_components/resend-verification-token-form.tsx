"use client";

import FormSubmitButton from "@/components/form-submit-button";
import { Button } from "@/components/ui/button";
import resendVerificationTokenAction from "@/actions/auth/resend-verification-token";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

interface ResendVerificationTokenFormProps {
    type: "email" | "password";
}

export default function ResendVerificationTokenForm() {
    const searchParams = useSearchParams();
    const emailId = searchParams.get("emailId") ?? "";
    
    const [_, action, pending] = useActionState(resendVerificationTokenAction, undefined);

    return(
        <form action={action}>
            <input type="hidden" name="emailId" value={emailId} hidden/>
            <Button variant="link" className="px-0">
                Resend code
            </Button>
        </form>
    );
}