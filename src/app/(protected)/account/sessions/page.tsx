import { getSessionsByUserId } from "@/db/queries/sessions";
import { validateRequest } from "@/lib/auth";
import SessionsList from "./_components/sessions-list";
import { forbidden } from "next/navigation";
import { Metadata } from "next";
import { SessionsSettingsProvider } from "./_components/sessions-settings-provider";

export const metadata: Metadata = {
    title: "Sessions | NextJS App",
};

export default async function SessionsPage() {
    const {user, session} = await validateRequest();
    if(!user || !session) {
        forbidden();
    }

    const userSessionId = session.id;
    const sessions = await getSessionsByUserId(user.id);

    return(
        <div className="flex flex-col gap-8 pb-10 max-w-[600px] w-full">
            <h1 className="text-center">
                Sessions
            </h1>
            <SessionsSettingsProvider value={{sessions, userSessionId: session.id}}>
                <SessionsList/>
            </SessionsSettingsProvider>
        </div>
    );
}