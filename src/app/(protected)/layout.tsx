import Navbar from "@/components/navbar";
import { SessionProvider } from "@/components/providers/session-provider";
import { validateRequest } from "@/lib/auth/lucia";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({children}: Readonly<{children: React.ReactNode}>) {
    const session = await validateRequest();
    if(!session.user || !session.session) {
        redirect("/auth/log-in");
    }
    else if(!session.user.verifiedEmail) {
        redirect(`/auth/verify-email?userId=${session.user.id}`);
    }

    return(
        <SessionProvider value={session}>
            <Navbar showUser/>
            <main className="flex flex-col items-center px-2 sm:px-4 mt-10">
                {children}
            </main>
        </SessionProvider>
    );
}