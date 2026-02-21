import { formatDateTimeShort } from "@/lib/date-format";
import { Session } from "@/lib/types/session";
import { Session as AuthSession } from "lucia";
import DeleteSessionDialog from "./delete-session-dialog";
import DialogLauncher from "@/components/dialog-launcher";
import { Trash2 } from "lucide-react";

interface SessionProps {
    session: Session;
    currentSession: AuthSession;
    deleteSession: (id: string) => void;
}

export default function SessionCard({session, currentSession, deleteSession}: SessionProps) {
    return(
        <div className="border p-4 rounded-md flex justify-between">
            <div className="flex gap-2 items-center">
                <span>
                    {session.os} {session.browser ? `(${session.browser})` : null} 
                </span>
                {currentSession.id === session.id ? (
                    <small>
                        (Current)
                    </small>
                ) : null}
            </div>
            <div className="flex gap-10 items-center">
                <span>
                    {formatDateTimeShort(session.createdAt)}
                </span>
                {currentSession.id !== session.id ? (
                    <DialogLauncher variant="ghost" icon={Trash2}>
                        <DeleteSessionDialog id={session.id} deleteSession={deleteSession}/>
                    </DialogLauncher>
                ) : (
                    <div className="w-9"></div>
                )}
            </div>
        </div>
    );
}