import { formatDateTimeShort } from "@/lib/utils/date-format";
import { Session as AuthSession } from "lucia";
import DeleteSessionDialog from "./delete-session-dialog";
import DialogLauncher from "@/components/dialog-launcher";
import { Trash2 } from "lucide-react";
import { Session } from "@/db/schema/sessions";

interface SessionProps {
    session: Session;
    currentSession: AuthSession;
}

export default function SessionCard({session, currentSession}: SessionProps) {
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
                        <DeleteSessionDialog id={session.id}/>
                    </DialogLauncher>
                ) : (
                    <div className="w-9"></div>
                )}
            </div>
        </div>
    );
}