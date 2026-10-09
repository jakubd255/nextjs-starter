import UpdatePasswordForm from "./update-password-form";
import SetPasswordForm from "./set-password-form";
import DialogLauncher from "@/components/kit/dialog-launcher";

interface Props {
    hasPassword: boolean;
}

export default function PasswordSection({hasPassword}: Props) {
    return(
        <section className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">
                Password
            </h2>
            <div>
                {hasPassword ? (
                    <DialogLauncher trigger={{variant: "outline", text: "Update password"}}>
                        <UpdatePasswordForm/>
                    </DialogLauncher>
                ) : (
                    <DialogLauncher trigger={{variant: "outline", text: "Set password"}}>
                        <SetPasswordForm/>
                    </DialogLauncher>
                )}
            </div>
        </section>
    );
}