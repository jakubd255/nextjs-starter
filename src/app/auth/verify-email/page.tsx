import ResendVerificationTokenForm from "@/components/forms/resend-verification-token-form";
import VerifyEmailForm from "@/components/forms/verify-email-form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Verify email | NextJS App",
};

export default function VerifyEmailPage() {
    return(
        <Suspense>
            <VerifyEmailForm/>
            <ResendVerificationTokenForm/>
        </Suspense>
    );
}