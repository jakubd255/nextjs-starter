"use client";

import { useActionState } from "react";
import updateProfileAction from "@/actions/users/update-profile";
import FormSubmitButton from "@/components/kit/form/form-submit-button";
import { UserProfile } from "@/db/schema/users";
import { FieldGroup, Form } from "@/components/kit/form/form";
import { TextareaField, TextField } from "@/components/kit/form/fields";
import { useFormValues } from "@/lib/hooks/use-form-values";

interface Props {
    user: UserProfile;
}

export default function UpdateProfileForm({user}: Props) {
    const [state, action, pending] = useActionState(updateProfileAction, undefined);

    const {values, bind} = useFormValues({
        name: user.name,
        bio: user.bio ?? ""
    });
    const disabled = values.name === user.name && values.bio === (user.bio ?? "");

    return(
        <Form action={action} className="w-full">
            <FieldGroup>
                <TextField
                    label="Name"
                    {...bind("name")}
                    errors={state?.errors?.name}
                />
                <TextareaField
                    label="Bio"
                    {...bind("bio")}
                />
                <input type="hidden" name="id" defaultValue={user.id} hidden/>
            </FieldGroup>
            <div className="flex">
                <FormSubmitButton pending={pending} disabled={disabled}>
                    Update
                </FormSubmitButton>
            </div>
        </Form>
    );
}