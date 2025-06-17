import { Email } from "@/lib/types"

interface EmailStatusProps {
    email: Email;
}

export default function EmailStatus({email}: EmailStatusProps) {
    return(
        <>
            {email.verified ? (
                <small className="px-1 rounded-md bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300">
                    Verified
                </small>
            ) : (
                <small className="px-1 rounded-md bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300">
                    Unverified
                </small>
            )}
            {email.primary && (
                <small className="px-1 rounded-md bg-emerald-100 text-emerald-500 dark:bg-emerald-900 dark:text-emerald-300">
                    Primary
                </small>
            )}
        </>
    );
}