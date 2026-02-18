import { User } from "@/lib/types";
import Link from "next/link";

interface UserEmailProps {
    user: User;
    showVerify?: boolean;
}

export default function UserEmail({user, showVerify=false}: UserEmailProps) {
    return(
        <div className="flex flex-col gap-2">
            <span>
                {user.email} {user.pendingEmail ? "(current)" : null}
            </span>
            {user.pendingEmail ? (
                <div className="flex gap-2">
                    <span className="opacity-70">
                        {user.pendingEmail} (pending)
                    </span>
                    {showVerify ? (
                        <Link className="font-bold text-primary hover:underline" href={`/auth/verify-email?userId=${user.id}`}>
                            Verify
                        </Link>
                    ) : null}
                </div>
            ) : null}
        </div>
    )
}