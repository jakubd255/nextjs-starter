import VerifyEmailForm from "@/app/auth/_components/verify-email-form";
import { Metadata } from "next";
import { Suspense } from "react";
import ResendVerificationTokenForm from "../_components/resend-verification-token-form";

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