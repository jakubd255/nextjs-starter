"use client";

import DialogProvider from "@/components/dialog-provider";
import { useSession } from "@/components/providers/session-provider";
import Link from "next/link";
import UpdateEmailForm from "./update-email-form";

export default function EmailSection() {
    const {user} = useSession();
    
    return(
        <section className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">
                Email
            </h2>
            <span>
                {user.email} {user.pendingEmail ? "(current)" : null}
            </span>
            {user.pendingEmail ? (
                <div className="flex gap-2">
                    <span>
                        {user.pendingEmail} (pending)
                    </span>
                    <Link className="font-bold text-primary hover:underline" href={`/auth/verify-email?userId=${user.id}`}>
                            Verify
                        </Link>
                    </div>
            ) : null}
            <div>
                <DialogProvider text="Change E-mail">
                    <UpdateEmailForm/>
                </DialogProvider>
            </div>
        </section>
    );
}