"use client";

import UpdateProfileForm from "@/components/settings/profile/update-profile-form";
import UpdateProfileImage from "@/components/settings/profile/update-profile-image";
import { User } from "@/lib/types";
import { useState } from "react";

interface ProfileSectionProps {
    user: User;
}

export default function ProfileSection({user: targetUser}: ProfileSectionProps) {
    const [user, setUser] = useState(targetUser);
    const updateUser = (data: Partial<User>) => {
        setUser({...user, ...data});
    }

    const onUpdateProfile = (name: string, bio?: string | null) => {
        updateUser({name, bio});
    }

    const onUpdateAvatar = (profileImage?: string | null) => {
        updateUser({profileImage});
    }

    return(
        <section className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">
                Profile
            </h2>
            <div className="gap-6 lg:gap-10 flex lg:flex-row flex-col-reverse">
                <UpdateProfileForm user={user} onUpdate={onUpdateProfile}/>
                <UpdateProfileImage user={user} onUpdate={onUpdateAvatar}/>
            </div>
        </section>
    );
}