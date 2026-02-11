"use client";

import { SessionFull } from "@/lib/types/session";
import { useState } from "react";
import { Session } from "lucia";
import SessionCard from "./session-card";

interface SessionsListProps {
    sessions: SessionFull[];
    currentSession: Session;
}

export default function SessionsList({sessions: sessionsList, currentSession}: SessionsListProps) {
    const [sessions, setSessions] = useState(sessionsList);
    const deleteSession = (id: string) => setSessions(prev => prev.filter(s => s.id !== id));

    return(
        <div className="flex flex-col gap-2">
            {sessions.map((session, index) => (
                <SessionCard 
                    session={session} 
                    currentSession={currentSession} 
                    deleteSession={deleteSession} 
                    key={index}
                />
            ))}
        </div>
    );
}