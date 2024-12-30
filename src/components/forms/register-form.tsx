"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import FormSubmitButton from "../form-submit-button";
import registerAction from "@/server-actions/register-action";
import FormSubmitError from "../form-submit-error";
import { useActionState } from "react";

export default function RegisterForm() {
    const [state, action] = useActionState(registerAction, undefined);

    return(
        <form className="flex flex-col gap-4" action={action}>
            <div className="flex flex-col gap-2">
                <div>
                    <Label htmlFor="name">
                        Name
                    </Label>
                    <Input type="text" name="name" id="name"/>
                    <FormSubmitError errors={state?.errors.name}/>
                </div>
                <div>
                    <Label htmlFor="email">
                        E-mail
                    </Label>
                    <Input type="email" name="email" id="email"/>
                    <FormSubmitError errors={state?.errors.email}/>
                </div>
                <div>
                    <Label htmlFor="password">
                        Password
                    </Label>
                    <Input type="password" name="password" id="password"/>
                    <FormSubmitError errors={state?.errors.password}/>
                </div>
            </div>
            <FormSubmitButton>
                <LogIn className="mr-2"/>
                Register
            </FormSubmitButton>
        </form>
    );
}