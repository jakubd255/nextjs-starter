import RequestResetPasswordForm from "../_components/request-reset-password-form";

export default function ForgotPasswordPage() {
    return(
        <div className="max-w-[400px] w-full flex flex-col gap-4">
            <h1 className="text-center">
                Forgot password
            </h1>
            <RequestResetPasswordForm/>
        </div>
    );
}