"use client";

import { Input } from "../ui/input";
import Link from "next/link";
import { Label } from "../ui/label";
import { useActionState } from "react";
import logInAction from "@/actions/auth/log-in";
import FormSubmitButton from "../form-submit-button";
import PasswordInput from "../password-input";
import FormSubmitError from "../form-submit-error";
import RedirectToCollector from "./redirect-to-collector";

export default function LogInForm() {
    const [state, action, pending] = useActionState(logInAction, undefined);
    
    return(
        <form className="flex flex-col gap-6" action={action}>
            <div className="flex flex-col gap-3">
                <div>
                    <Label htmlFor="email">
                        E-mail
                    </Label>
                    <Input type="email" name="email" id="email" defaultValue={state?.email}/>
                    <FormSubmitError errors={state?.errors?.email}/>
                </div>
                <div>
                    <div className="flex justify-between">
                        <Label htmlFor="password">
                            Password
                        </Label>
                        <Link className="font-bold text-sm text-primary hover:underline" href="/auth/forgot-password" >
                            Forgot password?
                        </Link>
                    </div>
                    <PasswordInput name="password" id="password"/>
                    <FormSubmitError errors={state?.errors?.password}/>
                </div>
            </div>
            <RedirectToCollector/>
            <FormSubmitButton pending={pending}>
                Log in
            </FormSubmitButton>
        </form>
    );
}