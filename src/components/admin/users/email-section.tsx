"use client";

import resendVerifyUserAction from "@/actions/users/resend-verify-user";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UserEmail from "@/components/settings/account/user-email";
import { handleActionResult } from "@/lib/action-result";
import { User } from "@/lib/types";
import { BadgeCheck } from "lucide-react";

interface EmailSectionProps {
    user: User;
}

export default function EmailSection({user}: EmailSectionProps) {
    const handleResetToken = async () => {
        const result = await resendVerifyUserAction(user.id);
        handleActionResult(result, "Successfully resent verification token");
    }

    return(
        <>
            <Separator/>
            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">
                    E-mail
                </h2>
                <UserEmail user={user}/>
                <div>
                    <Button 
                        variant="outline" 
                        disabled={user.verified && !user.pendingEmail} 
                        onClick={handleResetToken}
                    >
                        <BadgeCheck className="w-4 h-4"/>
                        Resend verification token
                    </Button>
                </div>
            </section>
        </>
    );
}