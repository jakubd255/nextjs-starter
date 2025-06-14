import { Email } from "@prisma/client";
import EmailMenu from "./email-menu";
import EmailStatus from "@/components/email-status";

interface UserEmailProps {
    email: Email;
}

export default function UserEmail({email}: UserEmailProps) {
    return(
        <div className="p-3 border rounded-md flex justify-between items-center">
            <div className="flex gap-2 text-sm">
                {email.email}
                <EmailStatus email={email}/>
            </div>
            <EmailMenu email={email}/>
        </div>
    );
}