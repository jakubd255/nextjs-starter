import DialogProvider from "@/components/dialog-provider";
import DeleteAccountForm from "./delete-account-form";

export default function DeleteAccountSection() {
    return(
        <section className="flex flex-col gap-2">
            <h2>
                Delete account
            </h2>
            <div>
                <DialogProvider text="Delete account" destructive>
                    <DeleteAccountForm/>
                </DialogProvider>
            </div>
        </section>
    );
}