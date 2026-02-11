import DialogProvider from "@/components/dialog-provider";
import UpdatePasswordForm from "./update-password-form";

export default function PasswordSection() {
    return(
        <section className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">
                Password
            </h2>
            <div>
                <DialogProvider text="Change password">
                    <UpdatePasswordForm/>
                </DialogProvider>
            </div>
        </section>
    );
}