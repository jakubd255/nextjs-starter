"use client";

import DeleteUserDialog from "./delete-user-dialog";
import { User } from "@/db/schema/users";
import { Separator } from "@/components/ui/separator";
import DialogLauncher from "@/components/kit/dialog-launcher";

interface Props {
    user: User;
    disabled?: boolean;
}

export default function DeleteUserSection({user, disabled=true}: Props) {
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
                        trigger={{text: "Delete user", variant: "destructive"}}
                        disabled={disabled}
                    >
                        <DeleteUserDialog user={user} redirect/>
                    </DialogLauncher>
                </div>
            </section>
        </>
    );
}