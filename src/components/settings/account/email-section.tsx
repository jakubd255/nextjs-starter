"use client";

import DialogLauncher from "@/components/dialog-launcher";
import { useSession } from "@/components/providers/session-provider";
import UpdateEmailForm from "./update-email-form";
import UserEmail from "@/components/user-email";

export default function EmailSection() {
    const {user} = useSession();
    
    return(
        <section className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">
                Email
            </h2>
            <UserEmail user={user} showVerify/>
            <div>
                <DialogLauncher text="Change E-mail">
                    <UpdateEmailForm/>
                </DialogLauncher>
            </div>
        </section>
    );
}