import Navbar from "@/components/navbar";
import { SessionProvider } from "@/components/providers/session-provider";
import { validateRequest } from "@/lib/auth";
import redirectToAuth from "@/lib/auth/redirect";
import { forbidden } from "next/navigation";

export default async function AdminLayout({children}: Readonly<{children: React.ReactNode}>) {
    const {user, session} = await validateRequest();
    if(!user || !session) {
        return await redirectToAuth();
    }

    if(user.role !== "ADMIN") {
        forbidden();
    }

    return(
        <SessionProvider value={{user, session}}>
            <Navbar showUser/>
            <main className="flex flex-col items-center px-2 sm:px-4 mt-10">
                <div className="flex w-full">
                    <div className="w-[300px]"></div>
                    <div className="flex flex-1 justify-center">
                        {children}
                    </div>
                    <div className="w-[300px]"></div>
                </div>
            </main>
        </SessionProvider>
    );
}