"use client";

import DialogProvider from "@/components/dialog-provider";
import UpdatePasswordDialogContentForm from "./forms/update-password-dialog-content-form";

export default function PasswordSection() {
    return(
        <section className="flex flex-col gap-2">
            <h2>
                Password
            </h2>
            <div>
                <DialogProvider text="Update password">
                    <UpdatePasswordDialogContentForm/>
                </DialogProvider>
            </div>
        </section>
    );
}