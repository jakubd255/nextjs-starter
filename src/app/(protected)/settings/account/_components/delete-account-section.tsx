import DialogProvider from "@/components/dialog-provider";
import DeleteAccountDialogContentForm from "./delete-account-dialog-content-form";

export default function DeleteAccountSection() {
    return(
        <section className="flex flex-col gap-2">
            <h2>
                Delete account
            </h2>
            <div>
                <DialogProvider text="Delete account" destructive>
                    <DeleteAccountDialogContentForm/>
                </DialogProvider>
            </div>
        </section>
    );
}