import UpdateProfileForm from "./update-profile-form";

export default function ProfileSection() {
    return(
        <section className="flex flex-col gap-2">
            <h2>
                Profile
            </h2>
            <UpdateProfileForm/>
        </section>
    );
}