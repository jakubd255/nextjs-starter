"use client";

import DialogProvider from "@/components/dialog-provider";
import { useAccountSettings } from "./account-settins-provider";
import UserEmail from "./user-email";
import AddEmailForm from "./add-email-form";

export default function EmailSection() {
    const {emails} = useAccountSettings();

    return(
        <section className="flex flex-col gap-2">
            <h2>
                Email
            </h2>
            {emails.map(email => (
                <UserEmail email={email} key={email.id}/>
            ))}
            <div>
                <DialogProvider text="Add email">
                   <AddEmailForm/>
                </DialogProvider>
            </div>
        </section>
    );
}