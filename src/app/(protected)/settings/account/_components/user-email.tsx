import { Email } from "@prisma/client";
import EmailMenu from "./email-menu";

interface UserEmailProps {
    email: Email;
}

export default function UserEmail({email}: UserEmailProps) {
    return(
        <div className="p-3 border rounded-md flex justify-between items-center">
            <div className="flex gap-2 text-sm">
                {email.email}
                {email.verified ? (
                    <div className="px-1 rounded-md bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300">
                        Verified
                    </div>
                ) : (
                    <div className="px-1 rounded-md bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300">
                        Unverified
                    </div>
                )}
                {email.primary && (
                    <div className="px-1 rounded-md bg-emerald-100 text-emerald-500 dark:bg-emerald-900 dark:text-emerald-300">
                        Primary
                    </div>
                )}
            </div>
            <EmailMenu email={email}/>
        </div>
    );
}