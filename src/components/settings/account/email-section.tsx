"use client";

import DialogLauncher from "@/components/dialog-launcher";
import UpdateEmailForm from "./update-email-form";
import UserEmail from "@/components/settings/account/user-email";
import { UserProfile } from "@/db/schema/users";

interface EmailSectionProps {
    user: UserProfile;
}

export default function EmailSection({user}: EmailSectionProps) {
    return(
        <section className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">
                Email
            </h2>
            <UserEmail user={user} showVerify/>
            <div>
                <DialogLauncher variant="outline" text="Change E-mail">
                    <UpdateEmailForm/>
                </DialogLauncher>
            </div>
        </section>
    );
}