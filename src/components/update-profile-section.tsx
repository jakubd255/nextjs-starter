import UpdateProfileForm from "./forms/update-profile-form";
import UpdateAvatarSection from "./update-avatar-section";

export default function UpdateProfileSection() {
    return(
        <section className="flex flex-col gap-2">
            <h2>
                Profile
            </h2>
            <UpdateAvatarSection/>
            <UpdateProfileForm/>
        </section>
    );
}