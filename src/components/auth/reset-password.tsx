"use client";

import { useActionState } from "react";
import FormSubmitButton from "../kit/form/form-submit-button";
import resetPasswordAction from "@/actions/auth/reset-password";
import { FieldGroup, Form } from "../kit/form/form";
import { PasswordField } from "../kit/form/fields";

interface Props {
    code: string;
}

export default function ResetPassword({code}: Props) {
    const [state, action, pending] = useActionState(resetPasswordAction, undefined);

    return(
        <Form action={action}>
            <FieldGroup>
                <PasswordField
                    label="New paswword"
                    name="newPassword"
                    errors={state?.errors?.newPassword}
                />
                <PasswordField
                    label="Confirm mew paswword"
                    name="confirmNewPassword"
                    errors={state?.errors?.confirmNewPassword}
                />
                <input type="hidden" name="code" defaultValue={code} hidden/>
            </FieldGroup>
            <FormSubmitButton pending={pending}>
                Reset password
            </FormSubmitButton>
        </Form>
    );
}