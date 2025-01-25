"use client";

import { Session, User } from "lucia";
import { createContext, useContext, useState } from "react";

interface ContextValueType {
    user: User;
    session: Session;
}

interface ContextType extends ContextValueType{
    updateUser: (updatedUser: Partial<User>) => void;
}

const SessionContext = createContext<ContextType | undefined>(undefined);

export const SessionProvider = ({children, value}: React.PropsWithChildren<{value: ContextValueType}>) => {
    const [user, setUser] = useState<User>(value.user);

    const updateUser = (updatedUser: Partial<User>) => {
        setUser((prevUser) => ({...prevUser, ...updatedUser})
    )};
    
    return(
        <SessionContext.Provider value={{...value, user, updateUser }}>
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSession must be used within SessionProvider");
    }
    return context;
};