import SessionsList from "@/components/settings/sessions/sessions-list";
import { getSessionsByUserId } from "@/db/queries/sessions";
import { requireAuth } from "@/lib/auth/session";
import { APP_TITLE } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Sessions | ${APP_TITLE}`,
};

export default async function SettingsSessionsPage() {
    const {user, session: currentSession} = await requireAuth();
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