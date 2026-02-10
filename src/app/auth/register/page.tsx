import AuthFormNavigate from "@/components/auth/auth-form-navigate";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
    return(
        <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-center">
                Register
            </h1>
            <RegisterForm/>
            <AuthFormNavigate text="Have an account?" href="log-in" name="Log in"/>
        </div>
    );
}