import UpdateProfileForm from "@/components/settings/profile/update-profile-form";
import UpdateProfileImage from "@/components/settings/profile/update-profile-image";
import { requireAuth } from "@/lib/auth/session";
import { APP_TITLE } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Profile | ${APP_TITLE}`,
};

export default async function SettingsProfilePage() {
    const {user} = await requireAuth();

    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                Profile
            </h1>
            <div className="gap-6 lg:gap-10 flex lg:flex-row flex-col-reverse">
                <UpdateProfileForm user={user}/>
                <UpdateProfileImage user={user}/>
            </div>
        </div>
    );
}