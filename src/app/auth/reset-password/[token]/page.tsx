import ResetPasswordForm from "../../_components/reset-password-form";

export default function ResetPasswordPage() {
    return(
        <div className="max-w-[400px] w-full flex flex-col gap-4">
            <h1 className="text-center">
                Reset password
            </h1>
            <ResetPasswordForm/>
        </div>
    );
}