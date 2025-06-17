"use client";

import { SessionFull } from "@/lib/types/session";
import Session from "./session";
import { useState } from "react";

interface SessionsListProps {
    initSessions: SessionFull[];
    userSessionId: string;
}

export default function SessionsList({initSessions, userSessionId}: SessionsListProps) {
    const [sessions, setSessions] = useState(initSessions);

    return(
        <div className="flex flex-col gap-2">
            {sessions.map(session => (
                <Session 
                    session={session} 
                    userSessionId={userSessionId}
                    key={session.id}
                    setSessions={setSessions}
                />
            ))}
        </div>
    );
}