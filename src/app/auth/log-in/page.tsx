import AuthFormNavigate from "@/components/auth-form-navigate";
import LoginForm from "@/components/forms/login-form";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Log in to NextJS App",
};

export default function LoginPage() {
    return(
        <div className="max-w-[400px] w-full flex flex-col gap-4">
            <h1 className="text-center">
                Log in
            </h1>
            <LoginForm/>
            <Separator/>
            <AuthFormNavigate text="Don't have an account?" href="register" name="Register"/>
        </div>
    );
}