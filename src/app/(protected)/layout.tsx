import Navbar from "@/components/navbar";
import { SessionProvider } from "@/components/providers/session-provider";
import { requireAuth } from "@/lib/auth/session";

export default async function ProtectedLayout({children}: Readonly<{children: React.ReactNode}>) {
    const {user, session} = await requireAuth();

    return(
        <SessionProvider value={{user, session}}>
            <Navbar showUser/>
            <main className="flex flex-col items-center px-2 sm:px-4 my-10">
                {children}
            </main>
        </SessionProvider>
    );
}