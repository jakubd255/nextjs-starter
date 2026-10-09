"use client";

import { useActionState } from "react";
import verifyEmailAction from "@/actions/auth/verify-email";
import FormSubmitButton from "../kit/form/form-submit-button";
import { Form } from "../kit/form/form";
import { TextField } from "../kit/form/fields";

interface Props {
    userId: string;
}

export default function VerifyEmailForm({userId}: Props) {
    const [state, action, pending] = useActionState(verifyEmailAction, undefined);
    
    return(
        <Form action={action}>
            <TextField
                label="Verification code"
                name="code"
                errors={state?.errors?.code}
            />
            <input type="hidden" name="userId" defaultValue={userId} hidden/>
            <FormSubmitButton pending={pending}>
                Verify E-mail
            </FormSubmitButton>
        </Form>
    );
}