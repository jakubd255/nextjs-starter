"use client";

import { createContext, useContext, useState } from "react";
import { Account, Email } from "@prisma/client";
import useEmails from "@/lib/hooks/useEmails";
import useAccounts from "@/lib/hooks/useAccounts";

interface ContextValueType {
    emails: Email[];
    accounts: Account[];
    hasPassword: boolean;
}

interface ContextType extends ContextValueType{
    addEmail: (email: Email) => void;
    deleteEmail: (emailId: string) => Promise<void>;
    setPrimary: (emailId: string) => Promise<void>;
    setPassword: () => void;
    getAccount: (providerName: string) => Account | undefined;
    deleteAccount: (providerName: string) => void;
}

const AccountSettingsContext = createContext<ContextType | undefined>(undefined);

export const AccountSettingsProvider = ({children, value}: React.PropsWithChildren<{value: ContextValueType}>) => {
    const [hasPassword, setHasPassword] = useState<boolean>(value.hasPassword);
    const setPassword = () => setHasPassword(true);

    const emails = useEmails(value.emails);
    const accounts = useAccounts(value.accounts);

    return(
        <AccountSettingsContext.Provider value={{hasPassword, setPassword, ...emails, ...accounts}}>
            {children}
        </AccountSettingsContext.Provider>
    );
}

export const useAccountSettings = () => {
    const context = useContext(AccountSettingsContext);
    if (context === undefined) {
        throw new Error("useAccountSettings must be used within a SessionProvider");
    }
    return context;
}