import DialogLauncher from "@/components/dialog-launcher";
import UpdatePasswordForm from "./update-password-form";
import SetPasswordForm from "./set-password-form";

interface PasswordSectionProps {
    hasPassword: boolean;
}

export default function PasswordSection({hasPassword}: PasswordSectionProps) {
    return(
        <section className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">
                Password
            </h2>
            <div>
                {hasPassword ? (
                    <DialogLauncher variant="outline" text="Change password">
                        <UpdatePasswordForm/>
                    </DialogLauncher>
                ) : (
                    <DialogLauncher variant="outline" text="Set password">
                        <SetPasswordForm/>
                    </DialogLauncher>
                )}
            </div>
        </section>
    );
}