"use client";

import UpdateProfileForm from "@/components/settings/profile/update-profile-form";
import UpdateProfileImage from "@/components/settings/profile/update-profile-image";
import { User } from "@/db/schema/users";

interface ProfileSectionProps {
    user: User;
}

export default function ProfileSection({user}: ProfileSectionProps) {
    return(
        <section className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">
                Profile
            </h2>
            <div className="gap-6 lg:gap-10 flex lg:flex-row flex-col-reverse">
                <UpdateProfileForm user={user}/>
                <UpdateProfileImage user={user}/>
            </div>
        </section>
    );
}