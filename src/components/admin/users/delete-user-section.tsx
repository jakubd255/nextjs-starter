"use client";

import DialogLauncher from "@/components/dialog-launcher";
import DeleteUserDialog from "./delete-user-dialog";
import { User } from "@/lib/types";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface DeleteUserSectionProps {
    user: User;
    disabled?: boolean;
}

export default function DeleteUserSection({user, disabled=true}: DeleteUserSectionProps) {
    const [open, setOpen] = useState(false);

    return(
        <>
            <Separator/>
            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">
                    Delete user
                </h2>
                <span>
                    Deleting the user is permanent. All user's data will be lost.
                </span>
                <div>
                    <DialogLauncher 
                        text="Delete user" 
                        variant="destructive" 
                        open={open} 
                        onOpenChange={setOpen} 
                        disabled={disabled}
                    >
                        <DeleteUserDialog user={user} redirect/>
                    </DialogLauncher>
                </div>
            </section>
        </>
    );
}