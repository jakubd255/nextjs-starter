"use client";

import DialogLauncher from "@/components/kit/dialog-launcher";
import UpdateEmailForm from "./update-email-form";
import UserEmail from "@/components/settings/account/user-email";
import { UserProfile } from "@/db/schema/users";

interface Props {
    user: UserProfile;
}

export default function EmailSection({user}: Props) {
    return(
        <section className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">
                Email
            </h2>
            <UserEmail user={user} showVerify/>
            <div>
                <DialogLauncher trigger={{variant: "outline", text: "Update E-mail"}}>
                    <UpdateEmailForm/>
                </DialogLauncher>
            </div>
        </section>
    );
}