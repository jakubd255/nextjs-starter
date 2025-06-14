import Navbar from "@/components/navbar";
import { SessionProvider } from "@/components/providers/session-provider";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({children}: Readonly<{children: React.ReactNode}>) {
    const {user, session} = await validateRequest();
    if(!user || !session) {
        redirect("/auth/log-in");
    }

    return(
        <SessionProvider value={{user, session}}>
            <Navbar showUser/>
            <main className="flex flex-col items-center px-2 sm:px-4 mt-10">
                {children}
            </main>
        </SessionProvider>
    );
}