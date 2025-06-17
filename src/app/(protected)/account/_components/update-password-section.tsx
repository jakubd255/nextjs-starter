"use client";

import DialogProvider from "@/components/dialog-provider";
import UpdatePasswordForm from "./update-password-form";

export default function UpdatePasswordSection() {
    return(
        <section className="flex flex-col gap-2">
            <h2>
                Password
            </h2>
            <div>
                <DialogProvider text="Update password">
                    <UpdatePasswordForm/>
                </DialogProvider>
            </div>
        </section>
    );
}