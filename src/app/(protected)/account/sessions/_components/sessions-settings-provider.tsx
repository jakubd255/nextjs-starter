"use client";

import deleteSessionAction from "@/actions/session/delete-session";
import { SessionFull } from "@/lib/types";
import { createContext, useContext, useState } from "react";

interface ContextValueType {
    sessions: SessionFull[];
    userSessionId: string;
}

interface ContextType extends ContextValueType{
    deleteSession: (id: string) => void;
}

const SessionsSettingsContext = createContext<ContextType | undefined>(undefined);

export const SessionsSettingsProvider = ({children, value}: React.PropsWithChildren<{value: ContextValueType}>) => {
    const [sessions, setSessions] = useState(value.sessions);

    const deleteSession = async (id: string) => {
        await deleteSessionAction(id);
        setSessions(prev => prev.filter(s => s.id !== id));
    }

    return(
        <SessionsSettingsContext.Provider value={{...value, deleteSession}}>
            {children}
        </SessionsSettingsContext.Provider>
    );
}

export const useSessionsSettings = () => {
    const context = useContext(SessionsSettingsContext);
    if (context === undefined) {
        throw new Error("useSessionsSettings must be used within SessionsSettingsProvider");
    }
    return context;
}