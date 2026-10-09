"use client";

import { useActionState } from "react";
import FormSubmitButton from "../kit/form/form-submit-button";
import requestResetPasswordAction from "@/actions/auth/request-reset-password";
import { Form } from "../kit/form/form";
import { TextField } from "../kit/form/fields";

export default function RequestResetPassword() {
    const [state, action, pending] = useActionState(requestResetPasswordAction, undefined);
    
    return(
        <Form action={action}>
            <TextField
                label="E-mail"
                type="email"
                name="email"
                errors={state?.errors?.email}
            />
            <FormSubmitButton pending={pending}>
                Next
            </FormSubmitButton>
        </Form>
    );
}