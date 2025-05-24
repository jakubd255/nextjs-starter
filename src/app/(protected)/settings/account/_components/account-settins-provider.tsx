"use client";

import { createContext, useContext } from "react";
import useEmails from "@/hooks/use-emails";
import { Email } from "@/types";

interface ContextValueType {
    emails: Email[];
}

interface ContextType extends ContextValueType{
    addEmail: (email: Email) => void;
    deleteEmail: (emailId: string) => Promise<void>;
    setPrimary: (emailId: string) => Promise<void>;
}

const AccountSettingsContext = createContext<ContextType | undefined>(undefined);

export const AccountSettingsProvider = ({children, value}: React.PropsWithChildren<{value: ContextValueType}>) => {
    const emails = useEmails(value.emails);

    return(
        <AccountSettingsContext.Provider value={{...emails}}>
            {children}
        </AccountSettingsContext.Provider>
    );
}

export const useAccountSettings = () => {
    const context = useContext(AccountSettingsContext);
    if (context === undefined) {
        throw new Error("useAccountSettings must be used within AccountSettingsProvider");
    }
    return context;
}