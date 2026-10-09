import ResetPassword from "@/components/auth/reset-password";

interface Props {
    params: Promise<{token: string}>;
}

export default async function ResetPasswordPage({params}: Props) {
    const {token} = await params;

    return(
        <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-center">
                Reset password
            </h1>
            <ResetPassword code={token}/>
        </div>
    );
}