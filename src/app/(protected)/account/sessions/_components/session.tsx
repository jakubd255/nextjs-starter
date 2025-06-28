import { SessionFull } from "@/lib/types/session";
import { format } from "date-fns";
import DeleteSessionDialog from "./delete-session-dialog";
import { useSessionsSettings } from "./sessions-settings-provider";

interface SessionsProps {
    session: SessionFull;
}

export default function Session({session}: SessionsProps) {
    const {userSessionId, deleteSession} = useSessionsSettings();

    const createdAt = format(new Date(session.createdAt!), "dd.MM.yyyy");
    const isThisDevice = session.id === userSessionId;

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
                deleteSession={deleteSession.bind(null, session.id)}
            />
        </div>
    );
}