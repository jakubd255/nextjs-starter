"use client";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useSession } from "../providers/session-provider";
import { Button } from "../ui/button";
import deleteProfileImageAction from "@/server-actions/user/delete-profile-image";
import useActionStateSuccess from "@/hooks/useActionStateSuccess";

export default function DeleteAvatarForm() {
    const {updateUser} = useSession();

    const [_, action] = useActionStateSuccess(deleteProfileImageAction, () => {
        updateUser({profileImage: undefined});
    });

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