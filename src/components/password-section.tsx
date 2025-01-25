"use client";

import UpdatePasswordDialogForm from "./forms/update-password-dialog-form";

export default function PasswordSection() {
    return(
        <section className="flex flex-col gap-2">
            <h2>
                Password
            </h2>
            <div>
                <UpdatePasswordDialogForm/>
            </div>
        </section>
    );
}