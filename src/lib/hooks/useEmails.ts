import deleteEmailAction from "@/server-actions/delete-email-action";
import setEmailPrimaryAction from "@/server-actions/set-email-primary-action";
import { Email } from "@prisma/client";
import { useState } from "react";

export default function useEmails(initialData: Email[]) {
    const [emails, setEmails] = useState<Email[]>(initialData);

    const deleteEmail = async (emailId: string) => {
        const result = await deleteEmailAction(emailId);
        if(result.success) {
            setEmails(emails => emails.filter(e => e.id !== emailId));
        }
    }

    const setPrimary = async (emailId: string) => {
        const result = await setEmailPrimaryAction(emailId);
        if(result.success) {
            setEmails(emails => emails.map(e => {
                e.primary = e.id === emailId;
                return e;
            }));
        }
    }

    const addEmail = (email: Email) => {
        setEmails(emails => [...emails, email]);
    }

    return {emails, deleteEmail, setPrimary, addEmail};
}