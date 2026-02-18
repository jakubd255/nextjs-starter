import AuthFormNavigate from "@/components/auth/auth-form-navigate";
import ContinueWithProviders from "@/components/auth/continue-with-providers";
import LogInForm from "@/components/auth/log-in-form";
import { APP_TITLE } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Log in to ${APP_TITLE}`,
};

export default function LogInPage() {
    return(
        <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-center">
                Log in
            </h1>
            <LogInForm/>
            <ContinueWithProviders/>
            <AuthFormNavigate text="Don't have an account?" href="register" name="Register"/>
        </div>
    );
}