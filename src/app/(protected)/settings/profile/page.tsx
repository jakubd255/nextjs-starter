import UpdateProfile from "@/components/settings/profile/update-profile";
import { APP_TITLE } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Profile | ${APP_TITLE}`,
};

export default function SettingsProfilePage() {
    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                Profile
            </h1>
            <UpdateProfile/>
        </div>
    );
}