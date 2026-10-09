"use client";

import { useActionState } from "react";
import registerAction from "@/actions/auth/register";
import FormSubmitButton from "../kit/form/form-submit-button";
import { FieldGroup, Form } from "../kit/form/form";
import { PasswordField, TextField } from "../kit/form/fields";

export default function RegisterForm() {
    const [state, action, pending] = useActionState(registerAction, undefined);
    
    return(
        <Form action={action}>
            <FieldGroup>
                <TextField
                    label="Name"
                    name="name"
                    defaultValue={state?.name}
                    errors={state?.errors?.name}
                />
                <TextField 
                    label="E-mail" 
                    type="email" 
                    name="email" 
                    defaultValue={state?.email} 
                    errors={state?.errors?.email}
                />
                <PasswordField
                    label="Password"
                    name="password"
                    errors={state?.errors?.password}
                    forgotPassword
                />
                <PasswordField
                    label="Confirm password"
                    name="confirmPassword"
                    errors={state?.errors?.confirmPassword}
                />
            </FieldGroup>
            <FormSubmitButton pending={pending}>
                Register
            </FormSubmitButton>
        </Form>
    );
}