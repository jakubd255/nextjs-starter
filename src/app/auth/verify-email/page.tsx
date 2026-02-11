import ResendVerificationTokenForm from "@/components/auth/resend-verification-token-form";
import VerifyEmailForm from "@/components/auth/verify-email-form";
import { Separator } from "@/components/ui/separator";

interface VerifyEmailPageProps {
    searchParams: Promise<{userId?: string}>
}

export default async function VerifyEmailPage({searchParams}: VerifyEmailPageProps) {
    const userId = (await searchParams).userId ?? "";

    return(
        <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-center">
                Verify E-mail
            </h1>
            <VerifyEmailForm userId={userId}/>
            <Separator/>
            <ResendVerificationTokenForm userId={userId}/>
        </div>
    );
}