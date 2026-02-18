import DialogLauncher from "@/components/dialog-launcher";
import UpdatePasswordForm from "./update-password-form";

export default function PasswordSection() {
    return(
        <section className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">
                Password
            </h2>
            <div>
                <DialogLauncher text="Change password">
                    <UpdatePasswordForm/>
                </DialogLauncher>
            </div>
        </section>
    );
}