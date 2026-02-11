"use client";

import { useSession } from "@/components/providers/session-provider";
import UpdateProfileForm from "./update-profile-form";
import UpdateProfileImage from "./update-profile-image";

export default function UpdateProfile() {
    const {user, updateUser} = useSession();

    const onUpdateProfile = (name: string, bio?: string | null) => {
        updateUser({name, bio});
    }

    const onUpdateAvatar = (profileImage?: string | null) => {
        updateUser({profileImage});
    }

    return(
        <div className="gap-6 lg:gap-10 flex lg:flex-row flex-col-reverse">
            <UpdateProfileForm user={user} onUpdate={onUpdateProfile}/>
            <UpdateProfileImage user={user} onUpdate={onUpdateAvatar}/>
        </div>
    );
}