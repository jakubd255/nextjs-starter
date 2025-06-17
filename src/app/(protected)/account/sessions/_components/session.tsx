import { SessionFull } from "@/lib/types/session";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";
import deleteSessionAction from "@/actions/session/delete-session";
import DeleteSessionDialog from "./delete-session-dialog";

interface SessionsProps {
    session: SessionFull;
    userSessionId: string;
    setSessions: Dispatch<SetStateAction<SessionFull[]>>
}

export default function Session({session, userSessionId, setSessions}: SessionsProps) {
    const createdAt = format(new Date(), "dd.MM.yyyy");
    const isThisDevice = session.id === userSessionId;

    const handleDeleteSession = async () => {
        await deleteSessionAction(session.id);
        setSessions(prev => prev.filter(s => s.id !== session.id));
    }

    return(
        <div className="border rounded-md p-3 flex justify-between items-center">
            <div className="flex flex-col">
                <span>
                    {session.browser ? `${session.browser} (${session.os})` : session.os}
                </span>
                {isThisDevice ? (
                    <small className="text-muted-foreground">
                        (This device)
                    </small>
                ) : null}
            </div>
            <small className="text-muted-foreground">
                {createdAt}
            </small>
            <DeleteSessionDialog 
                isThisDevice={isThisDevice} 
                deleteSession={handleDeleteSession}
            />
        </div>
    );
}
