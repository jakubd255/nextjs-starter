"use client";

import AddPasswordDialogForm from "./forms/add-password-dialog-form";
import UpdatePasswordDialogForm from "./forms/update-password-dialog-form";
import { useAccountSettings } from "./providers/account-settins-provider";

export default function PasswordSection() {
    const {hasPassword} = useAccountSettings();

    return(
        <section className="flex flex-col gap-2">
            <h2>
                Password
            </h2>
            <div>
                {hasPassword ? <UpdatePasswordDialogForm/> : <AddPasswordDialogForm/>}
            </div>
        </section>
    );
}