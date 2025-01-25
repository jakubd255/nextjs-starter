"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import registerAction from "@/server-actions/auth/register";
import { useActionState } from "react";
import FormSubmitError from "../form-submit-error";
import FormSubmitButton from "../form-submit-button";

export default function RegisterForm() {
    const [state, action, pending] = useActionState(registerAction, undefined);

    return(
        <form className="flex flex-col gap-4" action={action}>
            <div className="flex flex-col gap-2">
                <div>
                    <Label htmlFor="name">
                        Name
                    </Label>
                    <Input type="text" name="name" id="name" defaultValue={state?.name}/>
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
                    <Input type="password" name="password" id="password"/>
                    <FormSubmitError errors={state?.errors?.password}/>
                </div>
            </div>
            <FormSubmitButton pending={pending}>
                <LogIn className="mr-2"/>
                Register
            </FormSubmitButton>
        </form>
    );
}