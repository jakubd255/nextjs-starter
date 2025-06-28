"use client";

import Session from "./session";
import { useSessionsSettings } from "./sessions-settings-provider";

export default function SessionsList() {
    const {sessions} = useSessionsSettings();

    return(
        <div className="flex flex-col gap-2">
            {sessions.map(session => (
                <Session 
                    session={session} 
                    key={session.id}
                />
            ))}
        </div>
    );
}