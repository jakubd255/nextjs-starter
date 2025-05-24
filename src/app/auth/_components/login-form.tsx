"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import logInAction from "@/actions/auth/login";
import { useActionState } from "react";
import FormSubmitError from "@/components/form-submit-error";
import FormSubmitButton from "@/components/form-submit-button";
import Link from "next/link";

export default function LoginForm() {
    const [state, action, pending] = useActionState(logInAction, undefined);
    
    return(
        <form className="flex flex-col gap-4" action={action}>
            <div className="flex flex-col gap-2">
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
            <div className="flex flex-col gap-1 text-sm">
                <FormSubmitButton pending={pending}>
                    <LogIn className="mr-2"/>
                    Log in
                </FormSubmitButton>
                <Link href="/auth/reset-password" className="hover:underline">
                    Forgot password?
                </Link>
            </div>
        </form>
    );
}