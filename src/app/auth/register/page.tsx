import AuthFormNavigate from "@/components/auth-form-navigate";
import RegisterForm from "@/components/forms/register-form";
import OAuthLoginForm from "@/components/oauth-login-form";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register to NextJS App",
};

export default function LoginPage() {
    return(
        <div className="max-w-[400px] w-full flex flex-col gap-4">
            <h1 className="text-center">
                Register
            </h1>
            <OAuthLoginForm/>
            <Separator/>
            <RegisterForm/>
            <Separator/>
            <AuthFormNavigate text="Have an account?" href="log-in" name="Log in"/>
        </div>
    );
}