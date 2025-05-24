import AuthFormNavigate from "@/app/auth/_components/auth-form-navigate";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import RegisterForm from "../_components/register-form";

export const metadata: Metadata = {
    title: "Register to NextJS App",
};

export default function RegisterPage() {
    return(
        <div className="max-w-[400px] w-full flex flex-col gap-4">
            <h1 className="text-center">
                Register
            </h1>
            <RegisterForm/>
            <Separator/>
            <AuthFormNavigate text="Have an account?" href="log-in" name="Log in"/>
        </div>
    );
}