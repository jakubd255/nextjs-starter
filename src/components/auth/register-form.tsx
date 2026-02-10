"use client";

import { useActionState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import registerAction from "@/actions/auth/register";
import PasswordInput from "../password-input";
import FormSubmitError from "../form-submit-error";
import FormSubmitButton from "../form-submit-button";

export default function RegisterForm() {
    const [state, action, pending] = useActionState(registerAction, undefined);
    
    return(
        <form className="flex flex-col gap-6" action={action}>
            <div className="flex flex-col gap-3">
                <div>
                    <Label htmlFor="username">
                        Username
                    </Label>
                    <Input type="text" name="username" id="username" defaultValue={state?.name}/>
                    <FormSubmitError errors={state?.errors?.name}/>
                </div>
                <div>
                    <Label htmlFor="email">
                        E-mail
                    </Label>
                    <Input type="email" name="email" id="email" defaultValue={state?.email}/>
                    <FormSubmitError errors={state?.errors?.email}/>
                </div>
                <div>
                    <Label htmlFor="password">
                        Password
                    </Label>
                    <PasswordInput name="password" id="password"/>
                    <FormSubmitError errors={state?.errors?.password}/>
                </div>
                <div>
                    <Label htmlFor="confirmPassword">
                        Confirm password
                    </Label>
                    <PasswordInput name="confirmPassword" id="confirmPassword"/>
                    <FormSubmitError errors={state?.errors?.confirmPassword}/>
                </div>
            </div>
            <FormSubmitButton pending={pending}>
                Log in
            </FormSubmitButton>
        </form>
    );
}