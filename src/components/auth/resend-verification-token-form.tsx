"use client";

import { Button } from "@/components/ui/button";
import resendVerificationTokenAction from "@/actions/auth/resend-verification-token";
import { useActionState } from "react";

interface Props {
    userId: string;
}

export default function ResendVerificationTokenForm({userId}: Props) {    
    const [_, action] = useActionState(resendVerificationTokenAction, undefined);

    return(
        <form className="w-full" action={action}>
            <input type="hidden" name="userId" defaultValue={userId} hidden/>
            <Button className="w-full" variant="outline">
                Resend code
            </Button>
        </form>
    );
}
