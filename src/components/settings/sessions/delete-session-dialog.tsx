"use client";

import deleteSessionAction from "@/actions/sessions/delete-session";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRef } from "react";

interface DeleteSessionDialogProps {
    id: string;
    deleteSession: (id: string) => void;
}

export default function DeleteSessionDialog({id, deleteSession}: DeleteSessionDialogProps) {
    const ref = useRef<HTMLButtonElement>(null);

    const handleDeleteSession = async () => {
        const result = await deleteSessionAction(id);
        if(result.success) {
            deleteSession(id);
        }
        ref.current?.click();
    }

    return(
        <DialogHeader>
            <DialogTitle>
                Delete session
            </DialogTitle>
            <DialogDescription>
                This is the session for the device you are using now.
                Once deleted you will be logged out.
            </DialogDescription>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" ref={ref}>
                        Cancel
                    </Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDeleteSession}>
                    Delete
                </Button>
            </DialogFooter>
        </DialogHeader>
    );
}