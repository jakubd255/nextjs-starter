"use client";

import { useActionState } from "react";
import FormSubmitButton from "../form-submit-button";
import FormSubmitError from "../form-submit-error";
import PasswordInput from "../password-input";
import { Label } from "../ui/label";
import resetPasswordAction from "@/actions/auth/reset-password";

interface ResetPasswordProps {
    code: string;
}

export default function ResetPassword({code}: ResetPasswordProps) {
    const [state, action, pending] = useActionState(resetPasswordAction, undefined);

    return(
        <form className="flex flex-col gap-6" action={action}>
            <div className="flex flex-col gap-3">
                <div>
                    <Label htmlFor="newPassword">
                        New password
                    </Label>
                    <PasswordInput name="newPassword" id="newPassword"/>
                    <FormSubmitError errors={state?.errors?.newPassword}/>
                </div>
                <div>
                    <Label htmlFor="confirmNewPassword">
                        Confirm new password
                    </Label>
                    <PasswordInput name="confirmNewPassword" id="confirmNewPassword"/>
                    <FormSubmitError errors={state?.errors?.confirmNewPassword}/>
                </div>
            </div>
            <input type="hidden" name="code" defaultValue={code} hidden/>
            <FormSubmitButton pending={pending}>
                Reset password
            </FormSubmitButton>
        </form>
    )
}