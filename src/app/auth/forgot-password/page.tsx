import RequestResetPassword from "@/components/auth/request-reset-password";

export default function RequestResetPasswordPage() {
    return(
        <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-center">
                Reset password
            </h1>
            <RequestResetPassword/>
        </div>
    );
}