"use client";

import deleteSessionAction from "@/actions/sessions/delete-session";
import DialogLauncher from "@/components/dialog-launcher";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface DeleteSessionDialogProps {
    currentSessionId: string;
    id: string;
    deleteSession: (id: string) => void;
}

export default function DeleteSessionDialog({currentSessionId, id, deleteSession}: DeleteSessionDialogProps) {
    const handleDeleteSession = async () => {
        await deleteSessionAction(id);
        deleteSession(id);
    }

    if(currentSessionId === id) return(
        <DialogLauncher variant="ghost" icon={Trash2}>
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
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDeleteSession}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogHeader>
        </DialogLauncher>
    );

    else return(
        <Button variant="ghost" size="icon" onClick={handleDeleteSession}>
            <Trash2 className="w-4 h-4"/>
        </Button>
    );
}