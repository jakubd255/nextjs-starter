import UpdateProfile from "@/components/settings/profile/update-profile";

export default async function SettingsProfilePage() {
    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                Profile
            </h1>
            <UpdateProfile/>
        </div>
    );
}