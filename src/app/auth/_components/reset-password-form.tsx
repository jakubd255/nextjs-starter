"use client";

import FormSubmitError from "@/components/form-submit-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import resetPasswordAction from "@/actions/auth/reset-password";
import { useParams } from "next/navigation";
import { useActionState } from "react";

export default function ResetPasswordForm() {
    const [state, action] = useActionState(resetPasswordAction, undefined);
    const {token} = useParams<{token: string}>()

    return(
        <form action={action} className="flex flex-col gap-4">
            <div>
                <Label htmlFor="password">
                    Password
                </Label>
                <Input type="password" name="password" id="password"/>
                <FormSubmitError errors={state?.errors?.password}/>
                <Input type="hidden" name="code" value={token}/>
            </div>
            <Button>
                Reset password
            </Button>
        </form>
    );
}