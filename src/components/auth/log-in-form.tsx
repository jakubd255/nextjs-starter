"use client";

import { useActionState } from "react";
import logInAction from "@/actions/auth/log-in";
import FormSubmitButton from "../kit/form/form-submit-button";
import RedirectToCollector from "./redirect-to-collector";
import { FieldGroup, Form } from "../kit/form/form";
import { PasswordField, TextField } from "../kit/form/fields";

export default function LogInForm() {
    const [state, action, pending] = useActionState(logInAction, undefined);
    
    return(
        <Form action={action}>
            <FieldGroup>
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
            </FieldGroup>
            <RedirectToCollector/>
            <FormSubmitButton pending={pending}>
                Log in
            </FormSubmitButton>
        </Form>
    );
}