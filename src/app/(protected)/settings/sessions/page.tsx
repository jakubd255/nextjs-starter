import SessionsList from "@/components/settings/sessions/sessions-list";
import { getSessionsByUserId } from "@/db/queries/sessions";
import { validateRequest } from "@/lib/auth";
import { forbidden } from "next/navigation";

export default async function SettingsSessionsPage() {
    const {user, session: currentSession} = await validateRequest();
    if(!user) {
        forbidden();
    }

    const sessions = await getSessionsByUserId(user.id);

    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                Sessions
            </h1>
            <SessionsList sessions={sessions} currentSession={currentSession}/>
        </div>
    );
}