"use client";

import UserEmail from "./user-email";
import { useAccountSettings } from "./providers/account-settins-provider";
import AddEmailDialogForm from "./forms/add-email-dialog-form";

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