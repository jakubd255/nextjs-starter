import DialogLauncher from "@/components/dialog-launcher";
import DeleteAccountForm from "./delete-account-form";

export default function DeleteAccountSection() {
    return(
        <section className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">
                Delete account
            </h2>
            <span>
                Deleting your account is permanent. All your data will be lost.
            </span>
            <div>
                <DialogLauncher text="Delete account" variant="destructive">
                    <DeleteAccountForm/>
                </DialogLauncher>
            </div>
        </section>
    );
}