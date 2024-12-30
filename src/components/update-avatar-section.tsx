"use client";

import DeleteAvatarForm from "./forms/delete-avatar-form";
import UploadAvatarForm from "./forms/upload-avatar-form";
import { useSession } from "./providers/session-provider";
import UserAvatar from "./user-avatar";

export default function UpdateAvatarSection() {
    const {user} = useSession();

    return(
        <section className="flex gap-2 items-center z-1">
            <UserAvatar user={user} size="md"/>
            <UploadAvatarForm/>
            {user.profileImage && (
                <DeleteAvatarForm/>
            )}
        </section>
    );
}