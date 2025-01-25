"use client";

import AddEmailDialogForm from "./forms/add-email-dialog-form";
import { useAccountSettings } from "./providers/account-settins-provider";
import UserEmail from "./user-email";

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
                <AddEmailDialogForm/>
            </div>
        </section>
    );
}