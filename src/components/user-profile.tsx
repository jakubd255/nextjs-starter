"use client";

import { useSession } from "./providers/session-provider";
import UserAvatar from "./user-avatar";

export default function UserProfile() {
    const {user} = useSession();

    return(
        <div className="flex flex-col gap-3 items-center mt-10">
            <UserAvatar user={user} size="lg"/>
            <h1>
                {user.name}
            </h1>
            <p className="font-sans max-w-[600px] text-wrap whitespace-pre-line">
                {user.bio}
            </p>
        </div>
    );
}