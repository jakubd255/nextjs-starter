"use client";

import { useSession } from "@/components/providers/session-provider";
import UserAvatar from "@/components/user-avatar";
import UploadAvatarForm from "./forms/upload-avatar-form";
import DeleteAvatarForm from "./forms/delete-avatar-form";

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