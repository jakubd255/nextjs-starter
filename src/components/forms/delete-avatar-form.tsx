/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import deleteAvatarAction from "@/server-actions/delete-avatar-action";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useActionState, useEffect } from "react";
import { useSession } from "../providers/session-provider";
import { Button } from "../ui/button";

export default function DeleteAvatarForm() {
    const [state, action] = useActionState(deleteAvatarAction, undefined);
    const {updateUser} = useSession();

    useEffect(() => {
        if(state?.success) {
            updateUser({profileImage: undefined});
        }
    }, [state]);

    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Delete image
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Delete avatar
                    </DialogTitle>
                    <DialogDescription>
                        Your avatar image will be removed.
                    </DialogDescription>
                </DialogHeader>
                <form id="deleteAvatarForm" action={action}>
                </form>
                <DialogFooter>
                    <DialogClose>
                        <Button variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" form="deleteAvatarForm">
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}