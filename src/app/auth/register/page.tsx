import AuthFormNavigate from "@/components/auth/auth-form-navigate";
import ContinueWithProviders from "@/components/auth/continue-with-providers";
import RegisterForm from "@/components/auth/register-form";
import { APP_TITLE } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Register to ${APP_TITLE}`,
};

export default function RegisterPage() {
    return(
        <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-center">
                Register
            </h1>
            <RegisterForm/>
            <ContinueWithProviders/>
            <AuthFormNavigate text="Have an account?" href="log-in" name="Log in"/>
        </div>
    );
}